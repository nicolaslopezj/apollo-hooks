const fs = require('fs')
const spawn = require('child_process').spawn
require('colors')

const pkg = JSON.parse(fs.readFileSync('package.json'))
console.log(`\nWatching ${pkg.name} v${pkg.version}\n`.underline.bold)

const build = spawn('yarn', ['run', 'build'])
build.on('close', code => console.log('Initial build ready\n'.grey)) // ready
build.on('error', error => console.log(error))

const fileChanged = function(filename) {
  const build = spawn('yarn', ['run', 'build'])
  build.on('close', code => console.log('Rebuild ready\n'.grey)) // ready
  build.on('error', error => console.log(error))
}

const deleteFile = function(filename) {
  if (fs.lstatSync(filename).isDirectory()) {
    fs.readdirSync(filename).forEach(file => deleteFile(filename + '/' + file))
    fs.rmdirSync(filename)
  } else {
    fs.unlinkSync(filename)
  }
}

const fileEvent = function(eventType, filename) {
  const existsInLib = fs.existsSync('./lib/' + filename)
  const existsInSrc = fs.existsSync('./src/' + filename)
  const action = eventType === 'rename' ? (!existsInSrc ? 'deleted' : 'created') : 'changed'

  console.log(filename.bold + ` ${action}`.grey)
  if (action === 'deleted' && existsInLib) {
    deleteFile('./lib/' + filename)
  } else {
    fileChanged(filename)
  }
}

fs.watch('./src', {recursive: true}, fileEvent)
