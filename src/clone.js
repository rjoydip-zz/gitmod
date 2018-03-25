const pathKey = require('path-key')
const crossSpawn = require('cross-spawn')
const mkdirp = require('mkdirp')
const path = require('path')
const nodegit = require("nodegit")
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')

const { isExistingFolder } = require('./helper')

const spawn = (command, args, opts, cb) => {
    opts.stdio = 'inherit'

    const child = crossSpawn(command, args, opts)
    child.on('error', cb)
    child.on('close', (code) => {
        if (code !== 0) return cb(new Error('Non-zero exit code: ' + code))
        else return cb(null)
    })

    return child
}

const updateJSON = (dist, moduleName) => {
    return new Promise((resolve, reject) => {
        return readPkg(path.join(dist, moduleName, 'package.json')).then((clonePkg) => {
            return readPkg(path.join(process.cwd(), 'package.json')).then((projPkg) => {
                const depedencyValue = {}
                depedencyValue[moduleName] = !clonePkg.version ? clonePkg.version : '0.0.0'
                !projPkg.cloneDependencies ? projPkg.cloneDependencies = depedencyValue : Object.assign(projPkg.cloneDependencies, depedencyValue)
                return writePkg(path.join(process.cwd(), 'package.json'), projPkg).then(() => {
                    return resolve(null)
                }).catch((err)=> reject(err))
            }).catch((err)=> reject(err))
        }).catch((err)=> reject(err))
    })
}

module.exports = (url) => {
    const dist = 'clone_modules'
    const reponame = url.match(/([^/]+)\.git$/)[1]

    return new Promise((resolve, reject) => {
        return isExistingFolder(dist, (res) => {
            const args = [
                'clone',
                '--depth',
                1,
                url,
                dist + '/' + reponame
            ]

            if (res) {
                const isGitInstalled = !!process.env[pathKey()].toLowerCase().match('git')

                if (isGitInstalled) {
                    return spawn('git', args, {}, (err) => {
                        if (err) return reject(err.message += ' (git clone) (' + url + ')')
                        else {
                            updateJSON(dist, reponame).then(() => {
                                return resolve(true)
                            })
                        }
                    })
                } else {
                    return nodegit.Clone(url, path.join(process.cwd(), dist))
                        .then(repo => {
                            updateJSON(dist, reponame).then(() => {
                                return resolve(true)
                            })
                        })
                        .catch(repo => {
                            return reject(true)
                        })
                }
            } else {
                return mkdirp(path.join(process.cwd(), dist), (err) => {
                    if (err) return reject(err)
                    else {
                        return spawn('git', args, {}, (err) => {
                            if (err) reject(err.message += ' (git clone) (' + url + ')')
                            else {
                                updateJSON(dist, reponame).then(() => {
                                    return resolve(true)
                                })
                            }
                        })
                    }
                });
            }
        })
    })

}