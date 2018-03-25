const path = require('path')
const fs = require('fs-extra')
const omit = require('object.omit')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')

module.exports = (moduleName) => {
    return new Promise((resolve, reject) => {
        return fs.remove(path.join(process.cwd(), 'clone_modules', moduleName))
            .then(() => {
                return readPkg(path.join(process.cwd(), 'package.json'))
                    .then((projPkg) => {
                        projPkg.cloneDependencies = !projPkg.cloneDependencies ? {} : omit(projPkg.cloneDependencies, moduleName)
                        return writePkg(path.join(process.cwd(), 'package.json'), projPkg)
                            .then(() => resolve(null))
                            .catch((err) => reject(err))
                    })
                    .catch((err) => reject(err))
            })
            .catch(err => reject(err))
    })
}