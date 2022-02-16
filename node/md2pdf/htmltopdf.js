const {exec} = require('child_process')
const path = require('path')
const tempJS = require('template-js')
const fs = require('fs')
const program = require('commander')
const random = require('string-random')
let wkhtmltopdf = path.join(__dirname, './assets/lib/win/wkhtmltopdf/bin/wkhtmltopdf.exe')
const os = require('os');
const { title } = require('process')
// console.log('title===================', title)
console.log('process.cwd()===================', process.cwd())
console.log('__dirname=======================', __dirname)
console.log('wkhtmltopdf=====================', wkhtmltopdf)

if (os.type() == 'Linux') {
	//wkhtmltopdf =  path.join(__dirname, './assets/lib/linux/wkhtmltopdf')//`/usr/local/bin/wkhtmltopdf` 
}
let converter = (htmlfile, coverhtml, headerhtml, pdffile) => {
    return new Promise((resolve) => {
        exec(`${wkhtmltopdf} --enable-local-file-access --images --javascript-delay 1500 --disable-smart-shrinking -B 5mm -T 5mm -R 10mm -L 10mm -d 96 --debug-javascript --page-size A4 --viewport-size 1 --zoom 1 --header-html ${headerhtml}  cover ${coverhtml}  ${htmlfile} ${pdffile}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                resolve({code: -1, msg: err});
                return;
            }
            console.log(stdout, stderr)
            resolve({code: 0, msg: 'success'})
        })
    })
}

let readMdFile = (filepath) => {
    return new Promise((resolve) => {
        fs.access(filepath, (err) => {
            if (err) {
                console.log(err)
                resolve({code: -1, msg: err.message})
            }
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    console.log(err)
                    resolve({code: -2, msg: err.message})
                }
                resolve({code: 0, msg: 'success', data: data})
            })
        })
    })
}

let genaratefile = (tmpl, path) => {
    return new Promise((resolve) => {
        console.log('writeFile=========', path)
        fs.writeFile(path, tmpl, (err) => {
            if (err) {
                console.log(err)
                resolve({code: -1, msg: err.message})
            }
            resolve({code: 0, msg: 'success'})
        })
    })
}

let main = async () => {
    console.log(`PID:${process.pid}`)
    let tmphtmlfile = `${(new Date()).getTime()}-${random()}.html`
    let tmpcoverfile = `${(new Date()).getTime()}-${random()}-cover.html`
    let tmpheaderfile = `${(new Date()).getTime()}-${random()}-header.html`
    let mdString = ''
    let security = 1
    let headerOptions = {}
    headerOptions['securityText'] = null
    let autonumbering = false
    program
        .version('1.0.0')
        .option('--md-file [name]', 'markdown 文件路径')
        .option('--md [string]', 'markdown 字符串')
        .option('--out-pdf [path]', '保持PDF的路径')
        .option('--title [title]', '文档标题')
        .option('--security [en/ch][1-5]', '文档保密性, ch或者en表示水印使用的语言，数字表示级别，如，ch2:表示中文，保密级别为2级')
        .option('--auto-numbering', '可选。需要自动章节编号')
        .parse(process.argv)
    
    if (!program.md) {
        if(!program.mdFile) {
            console.log('Error: No md or md-file option.')
            process.exit(-1)
            return
        }
        let ret = await readMdFile(program.mdFile)
        if (ret.code !== 0) {
            console.log('Error: No md option.')
            process.exit(ret.code)
            return
        }
        mdString = ret.data
    } else {
        mdString = program.md
    }
    if (program.security) {
        security = program.security
        slang = security.substring(0, 2)
        let cls = security.slice(-1)
        switch (cls) {
            case '2':
                headerOptions['securityText'] = slang === 'ch'? "百富秘密" : 'PAX Secret'
                headerOptions['fontsize'] = slang === 'ch'? 170: 100
                headerOptions['left'] = slang === 'ch'?  0: 0
                break;
            case '3':
            case '4':
                headerOptions['securityText'] = slang === 'ch'? "百富机密" : 'PAX Confidential'
                headerOptions['fontsize'] = slang === 'ch'? 170: 92
                headerOptions['left'] = slang === 'ch'?  0: -20
                break;
            case '5':
                headerOptions['securityText'] = slang === 'ch'? "百富绝密" : 'PAX Sensitive'
                headerOptions['fontsize'] = slang === 'ch'? 170: 100
                headerOptions['left'] = slang === 'ch'?  0: -20
                break;
            default:break;
        }
    }
    if (!program.outPdf) {
        console.log('Error: No out-pdf option.')
        process.exit(-1)
        return
    }
    if (!program.title) {
        console.log('Error: No title option.')
        process.exit(-1)
        return
    }
    if (program.autoNumbering) {
        autonumbering = true;
    }
    let tmp = new tempJS(path.join(__dirname, './index.tmpl'), {text: mdString, autonumbering: autonumbering, baseUrl: 'file:///' +  __dirname.replace(/\\/g, '/'),})
    console.log('index.tmpl', path.join(__dirname, './index.tmpl'))
    let covertmp = new tempJS(path.join(__dirname, './cover.tmpl'), {title: program.title, baseUrl: 'file:///' +  __dirname.replace(/\\/g, '/')})
    console.log('cover.tmpl', path.join(__dirname, './cover.tmpl'))
    let headerTmp = new tempJS(path.join(__dirname, './header.tmpl'), Object.assign(headerOptions, {baseUrl: 'file:///' +  __dirname.replace(/\\/g, '/') }))
    console.log('header.tmpl', path.join(__dirname, './header.tmpl'))
    let ret = await genaratefile(covertmp.toString(), tmpcoverfile)
    if (ret.code!==0) {
        console.log('Error: Generate cover html fail.')
        process.exit(-1)
        return
    }
    ret = await genaratefile(headerTmp.toString(), tmpheaderfile)
    if (ret.code!==0) {
        console.log('Error: Generate header html fail.')
        process.exit(-1)
        return
    }
    walk(__dirname)
    fs.writeFile(tmphtmlfile, tmp.toString(), (err) => {
        if (err) {
            console.log('Error: Write html failed.')
            console.error(err);
            process.exit(-2)
            return
        }
        converter(tmphtmlfile, tmpcoverfile, tmpheaderfile, program.outPdf).then((data) => {
            if (data.code === 0) {
                console.log('Success')
            } else {
                console.log(`Error: ${data.msg}`)
            }
            fs.unlink(tmphtmlfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            fs.unlink(tmpcoverfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            fs.unlink(tmpheaderfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            process.exit(data.code)
            return
        }).catch ((err) => {
            console.log('aaaaaaaaaaaaaaaa')
            fs.unlink(tmphtmlfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            fs.unlink(tmpcoverfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            fs.unlink(tmpheaderfile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            console.log(`Error: ${err.toString()}`)
            process.exit(-1)
            return
        })
    })
}

main()

var walk = function(dir) {
  fs.readdir(dir, function(err, list) {
    list.forEach(function(file) {
        if (file === 'editor.md') {
            return
        }
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file);
        } else {
          console.log(path.resolve(dir, file))
        }
      });
    });
  });
};



