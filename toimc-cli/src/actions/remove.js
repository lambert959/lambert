// program
//   .command('rm <dir>')
//   .option('-r, --recursive', 'Remove recursively')
//   .action(function (dir, cmdObj) {
//     console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''))
//     console.log('cmdObj.recursive', cmdObj.recursive)
//   })
module.exports = (args) => {
  console.log('args', args)
}
