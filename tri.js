const rename_keys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
const obj = { name: 'Bobo', job: 'Programmer', shoeSize: 100 };
console.log("Original Object");
console.log(obj);
console.log("-------------------------------------");
result = rename_keys({ id: 'IDNUMBER', gender: 'GENDER' }, obj);
console.log("New Object");
console.log(result);
// var json = [{
//     "id" : "1", 
//     "msg"   : "hi",
//     "tid" : "2013-05-05 23:35",
//     "fromWho": "hello1@email.se"
// },
// {
//     "id" : "2", 
//     "msg"   : "there",
//     "tid" : "2013-05-05 23:45",
//     "fromWho": "hello2@email.se"
// }];

// json.forEach((item) => {
//   console.log('ID: ' + item.id);
//   console.log('MSG: ' + item.msg);
//   console.log('TID: ' + item.tid);
//   console.log('FROMWHO: ' + item.fromWho);
// });