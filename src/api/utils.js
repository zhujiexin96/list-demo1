import AV from '@/utils/AV'

// let cuser = AV.User.current();
// AV.masterKey = cuser.get('mk')
// console.log('mk',cuser.get('mk'))

let updateConfig = null;
// let reg = /[5-9]\d{5}/;
let reg = /^((?!([5-9]\d{5})).)*$/; // 不包含

!!AV.masterKey && (updateConfig = {useMasterKey: true})

function _genStrRegExp(value){
  let regexStr =  value.replace(/\s+/g, '\\s+');
  return new RegExp(regexStr,'i')
}

export function getList(form, bool, equalObj,limit,skip) {
  return new Promise((resovle, reject) => {
    const query = new AV.Query(form)
    query.limit(limit||100) // leancloud默认返回 100 条结果
    !!skip && query.skip(skip)

    bool && query.descending('createdAt')

    if(equalObj){
      Object.keys(equalObj).map((item,index)=>{
        let value = equalObj[item]

        if(equalObj.blend){
          if(item == 'enterprise' || item == 'project' || item == 'address'){
            let regexStr =  value.replace(/\s+/g, '\\s+');
            let regex = new RegExp(regexStr,'i')
            value && query.matches(item, regex);
          }else if(item == 'time'){
            if(value &&value.length!=0){
              query.greaterThanOrEqualTo('createdAt', new Date(`${value[0]} 00:00:00`));
              query.lessThan('createdAt', new Date(`${value[1]} 23:59:59`));
            }
          }else if(item!='blend'){
            value && query.equalTo(item, value);
          }
        }else{
          value && query.equalTo(item, value);
        }
      })
    }

    query.find().then((todo) => {
      // console.log(`获取${form}表单数据成功！`, todo)
      resovle(todo)
    }, (err) => {
      console.log(`获取${form}表单数据失败`, err)
      reject(err)
    })
  })
}

export function amendClass(id, form, obj) {
  return new Promise((resolve, reject) => {
    const todo = AV.Object.createWithoutData(form, id)
    const keys = Object.keys(obj)

    keys.map(item => {
      if(item == 'mk'){
        todo.set(item,obj[item]?AV.masterKey:'')
      }else{
        todo.set(item, obj[item])
      }
    })

    todo.save(null,updateConfig).then(res => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

export function addClass(form, obj) {
  return new Promise((resolve, reject) => {
    const Todo = AV.Object.extend(form)
    const newClass = new Todo()
    const keys = Object.keys(obj)
    keys.map(item => {
      newClass.set(item, obj[item])
    })
    newClass.save().then(res => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

export function addClassAll(form, obj) {
  return new Promise((resolve, reject) => {
    let objects = [];
    obj.map((item,index)=>{
      let object = new AV.Object(form);
      const keys = Object.keys(item)
      keys.map(item2 => {
        object.set(item2, item[item2])
      })
      objects.push(object)
    })

    AV.Object.saveAll(objects).then((res)=>{
      resolve(res)
    },(err)=>{
      reject(err)
    })
  })
}

export function deleteClass(form, id) {
  return new Promise((resolve, reject) => {
    const todo = AV.Object.createWithoutData(form, id)
    todo.destroy().then(res => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

export function queryClass(form, item1, item2) {
  return new Promise((resolve, reject) => {
    const query = new AV.Query(form)
    if(item2){
      query.equalTo(item1, item2)
    }else{
      const keys = Object.keys(item1)
      query.startsWith(keys[0],item1[keys[0]])
    }
    query.find().then(res => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

export function getCount(form,userInfo,equalObj){

  let _equalObj = JSON.parse(JSON.stringify(equalObj));
  delete _equalObj.blend;

  console.log('getCount查询条件:',_equalObj);
  let query  = new AV.Query(form);

  Object.keys(_equalObj).map((item)=>{
    let value = _equalObj[item];
    if (item && value) {

      if (item == 'itemName') {
        if (value == '无单号') {
          query.matches(item, reg);
        }else{
          query.matches(item, _genStrRegExp(value));
        }

      }else if(item == 'city'){
        console.log('value:',value);
        // 原本归属地是用字符串搜索
        // if ('广州'.indexOf(value)>-1) {
        //   query.equalTo(item, ''+0);
        // }

        // if ('上海'.indexOf(value)>-1) {
        //   query.equalTo(item, ''+1);
        // }

        query.equalTo(item, value);

      }else if( item == 'receiver'){
        query.contains(item, value);
      }else if(item == 'time'){
        if(value.length){
          query.greaterThanOrEqualTo('createdAt', new Date(`${value[0]} 00:00:00`));
          query.lessThan('createdAt', new Date(`${value[1]} 23:59:59`));
        }
      }else if(item == 'isBigProj' || item == 'isDone'){
        if(typeof(value) == 'number'){
          query.equalTo(item, !!value);
        }
      }else if(item == 'url'){
        query.matches(item, _genStrRegExp(value));
      }
      else{
        query.equalTo(item, value);
      }
    }
  })

  if (!userInfo.mk) {
    query.equalTo('receiver', userInfo.email);
  }
  return query.count()
}