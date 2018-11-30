// 扩展数组类

// 打包命名空间参数
Array.prototype.pushNamespace = function(...args) {
  args = args.map(item => {
    if(/object/i.test(item)) {
      if(item.nameSpace) {
        return item;
      } else {
        return {
          nameSpace: 'default',
          data: item.data
        }
      }
    } else {
      return {
        nameSpace: 'default',
        data: item
      }
    }
  });

  this.push(...args);
};

// 查询命名空间参数
Array.prototype.findNamespace = function(nameSpace = 'default', subscript) {
  let data = this.filter(item => item.nameSpace === nameSpace)
                  .map(item => item.data);

  // 第二个参数是查询符合条件的全部数据
  if(/boolean/i.test(typeof subscript) && subscript) {
    return data;
  } else {
    if(subscript === undefined) {
      subscript = data.length - 1; // 默认取最后一条
    }
    return data[subscript];
  }
}

export default Array;