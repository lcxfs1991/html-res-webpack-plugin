"use strict";

const path = require('path'),
      expect = require('expect.js'),
	  fs = require('fs-extra');

const TEST = path.resolve('test');

function trimString(str) {
    return str.replace(/(\r\n|\n|\r)/gm,"");
}

describe("resource-dev", function() {
  	it("=> dev environment && custom html path", function() {
  		let distHtml = path.join(TEST, 'dist/resource-dev/html/entry.html'),
  			resultHtml = path.join(TEST, '/result/resource-dev/index.html');

  		let distContent = trimString(fs.readFileSync(distHtml, "utf-8")),
  			resultContent = trimString(fs.readFileSync(resultHtml, "utf-8"));

    	expect(resultContent).to.be(distContent);

        let folder =  path.join(TEST, 'dist/resource-dev');
        let fileInfo = fs.readdirSync(folder);

        expect(fileInfo).to.eql([ 'css', 'html', 'js', 'libs']);
  	});
});

describe("resource-dev1", function() {
    it("=> html mode dev environment && custom html path", function() {
        let distHtml = path.join(TEST, 'dist/resource-dev1/html/entry.html'),
            resultHtml = path.join(TEST, '/result/resource-dev1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, "utf-8")),
            resultContent = trimString(fs.readFileSync(resultHtml, "utf-8"));

        expect(true).to.be(distContent === resultContent);

        let folder =  path.join(TEST, 'dist/resource-dev1');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.eql([ 'css', 'html', 'js']);

        let jsfolder = path.join(TEST, 'dist/resource-dev1/js');
        let jsInfo = fs.readdirSync(jsfolder);
        expect(jsInfo).to.eql(['index.js', 'libs']);

    });
});

describe("resource-dev2", function() {
    it("=> html mode dev environment with extension", function() {
        let distHtml = path.join(TEST, 'dist/resource-dev2/html/entry.html'),
            resultHtml = path.join(TEST, '/result/resource-dev2/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);

        let folder =  path.join(TEST, 'dist/resource-dev2');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.eql([ 'css', 'html', 'js']);

        let jsfolder = path.join(TEST, 'dist/resource-dev2/js');
        let jsInfo = fs.readdirSync(jsfolder);
        expect(jsInfo).to.eql(['index.js', 'libs']);

    });
});

describe("resource-dev3", function() {
    it("=>lack of resources", function() {
        let distHtml = path.join(TEST, 'dist/resource-dev3/html/entry.html'),
            resultHtml = path.join(TEST, '/result/resource-dev3/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);

        let folder =  path.join(TEST, 'dist/resource-dev3');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.eql([ 'html', 'js', 'libs']);

        let jsfolder = path.join(TEST, 'dist/resource-dev3/js');
        let jsInfo = fs.readdirSync(jsfolder);
        expect(jsInfo).to.eql(['index.js']);
    });
});

describe("resource-inline-1", function() {
	it("=> inline without compression", function() {
    	let distHtml = path.join(TEST, 'dist/resource-inline-1/index.html'),
  			resultHtml = path.join(TEST, 'result/resource-inline-1/index.html');

  		let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
  			resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let folder =  path.join(TEST, 'dist/resource-inline-1');
        let folderInfo = fs.readdirSync(folder);

        expect(folderInfo.length).to.be(1);
        expect(folderInfo[0]).to.be('index.html');

    	expect(true).to.be(distContent === resultContent);
  	});
});

describe("resource-inline-2", function() {
	it("=> inline with compression", function() {
    	let distHtml = path.join(TEST, 'dist/resource-inline-2/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-2/index.html');

  		let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
  			resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let folder =  path.join(TEST, 'dist/resource-inline-2');
        let folderInfo = fs.readdirSync(folder);

        expect(folderInfo.length).to.be(1);
        expect(folderInfo[0]).to.be('index.html');

        expect(true).to.be(distContent === resultContent);
  	});
});

describe("resource-inline-3", function() {
  it("=> html mode inline with compression", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-3/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-3/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let folder =  path.join(TEST, 'dist/resource-inline-3');
        let folderInfo = fs.readdirSync(folder);

        expect(folderInfo.length).to.be(3);
        expect(folderInfo[0]).to.be('detail.html');
        expect(folderInfo[1]).to.be('index.html');

        expect(true).to.be(distContent === resultContent);

        let jsFolder = path.join(TEST, 'dist/resource-inline-3/js'),
            jsInfo = fs.readdirSync(jsFolder);

        expect(jsInfo.length).to.be(1);
    });
});

describe("resource-inline-4", function() {
    it("=> html mode inline without compression in dev mode", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-4/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-4/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let folder =  path.join(TEST, 'dist/resource-inline-4');
        let folderInfo = fs.readdirSync(folder);

        expect(folderInfo.length).to.be(3);
        expect(folderInfo[1]).to.be('index.html');

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-inline-5", function() {
    it("=> inline without compression in dev mode ", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-5/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-5/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let folder =  path.join(TEST, 'dist/resource-inline-5');
        let folderInfo = fs.readdirSync(folder);

        expect(folderInfo.length).to.be(3);
        expect(folderInfo[1]).to.be('index.html');

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-inline-6", function() {
    it("=> inline without compression with extension", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-6/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-6/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-inline-7", function() {
    it("=> inline without compression with extension", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-7/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-7/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-inline-8", function() {
    it("=> inline without compression with extension", function() {
        let distHtml = path.join(TEST, 'dist/resource-inline-8/index.html'),
            resultHtml = path.join(TEST, 'result/resource-inline-8/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-md5-1", function() {
  	it("=> md5 with compression / index chunk before react", function() {
        let distHtml = path.join(TEST, 'dist/resource-md5-1/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-1/index.html');

  		let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
  			resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-1/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

    	expect(true).to.be(distContent === resultContent);
  	});
});

describe("resource-md5-2", function() {
  	it("=> md5 without compression  / react chunk before index", function() {
    	let distHtml = path.join(TEST, 'dist/resource-md5-2/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-2/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-2/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);
  	});
});

describe("resource-md5-3", function() {
    it("=> html mode md5 without compression", function() {
        let distHtml = path.join(TEST, 'dist/resource-md5-3/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-3/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-3/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-md5-4", function() {
    it("=> html mode md5 with compression and without quote", function() {
        let distHtml = path.join(TEST, 'dist/resource-md5-4/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-4/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-4/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let cdnFolder = path.join(TEST, 'dist/resource-md5-4/cdn'),
            cdnInfo = fs.readdirSync(cdnFolder);

        expect(cdnInfo).to.eql(['css', 'js']);
    });
});

describe("resource-md5-5", function() {
    it("=> html mode md5 without compression with extension", function() {
        let distHtml = path.join(TEST, 'dist/resource-md5-5/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-5/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-5/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let cdnFolder = path.join(TEST, 'dist/resource-md5-5/cdn'),
            cdnInfo = fs.readdirSync(cdnFolder);

        expect(cdnInfo).to.eql(['css', 'js']);
    });
});

describe("resource-favico", function() {
  	it("=> generate favicon", function() {
    	let distHtml = path.join(TEST, 'dist/resource-favico/index.html'),
            resultHtml = path.join(TEST, 'result/resource-favico/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-favico/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let srcFavicon = fs.lstatSync(path.join(TEST, 'src/resource-favico/favicon.ico')),
            destFavicon = fs.lstatSync(path.join(TEST, 'src/resource-favico/favicon.ico'));
  	    
        expect(srcFavicon.size).to.eql(destFavicon.size);

    });
});

describe("resource-favico1", function() {
    it("=> html mode generate favicon", function() {
        let distHtml = path.join(TEST, 'dist/resource-favico-1/index.html'),
            resultHtml = path.join(TEST, 'result/resource-favico-1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-favico-1/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let srcFavicon = fs.lstatSync(path.join(TEST, 'src/resource-favico-1/favicon.ico')),
            destFavicon = fs.lstatSync(path.join(TEST, 'src/resource-favico-1/favicon.ico'));
        
        expect(srcFavicon.size).to.eql(destFavicon.size);
    });
});

describe("resource-common-1", function() {
    it("=> common chunk generated by webpack", function() {
        let distHtml = path.join(TEST, 'dist/resource-common-1/index.html'),
                resultHtml = path.join(TEST, 'result/resource-common-1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-common-1/manifest.json'), "utf-8") || "{}");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        let folder = path.join(TEST, 'dist/resource-common-1'),
            folderInfo = fs.readdirSync(folder);
        expect(folderInfo).to.eql([ 'chunk', 'css', 'index.html', 'js', 'libs', 'manifest.json' ]);

        let jsFolder = path.join(TEST, 'dist/resource-common-1/js'),
            jsInfo = fs.readdirSync(jsFolder);
        expect(jsInfo.length).to.be(3);

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-common-2", function() {
    it("=> html mode common chunk generated by webpack", function() {
        let distHtml = path.join(TEST, 'dist/resource-common-2/index.html'),
                resultHtml = path.join(TEST, 'result/resource-common-2/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-common-2/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        let folder = path.join(TEST, 'dist/resource-common-2'),
            folderInfo = fs.readdirSync(folder);
        expect(folderInfo).to.eql([ 'chunk', 'css', 'index.html', 'js', 'libs', 'manifest.json' ]);

        let jsFolder = path.join(TEST, 'dist/resource-common-2/js'),
            jsInfo = fs.readdirSync(jsFolder);
        expect(jsInfo.length).to.be(3);
        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-copy-plugin-1", function() {
    it("=> usage with copy-webpack-plugin", function() {
        let distHtml = path.join(TEST, 'dist/resource-copy-plugin-1/index.html'),
                resultHtml = path.join(TEST, 'result/resource-copy-plugin-1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));
        
        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-copy-plugin-1/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let folder = path.join(TEST, 'dist/resource-copy-plugin-1'),
            folderInfo = fs.readdirSync(folder);
        expect(folderInfo).to.eql([ 'css', 'index.html', 'js', 'libs', 'manifest.json' ]);

        let libFolder = path.join(TEST, 'dist/resource-copy-plugin-1/libs'),
            libInfo = fs.readdirSync(libFolder);
        expect(libInfo.length).to.be(2);

    });
});

describe("resource-copy-plugin-2", function() {
    it("=> usage with copy-webpack-plugin with attributes", function() {
        let distHtml = path.join(TEST, 'dist/resource-copy-plugin-2/index.html'),
                resultHtml = path.join(TEST, 'result/resource-copy-plugin-2/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-copy-plugin-2/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let folder = path.join(TEST, 'dist/resource-copy-plugin-2'),
            folderInfo = fs.readdirSync(folder);
        expect(folderInfo).to.eql([ 'css', 'index.html', 'js', 'libs', 'manifest.json' ]);

        let libFolder = path.join(TEST, 'dist/resource-copy-plugin-2/libs'),
            libInfo = fs.readdirSync(libFolder);
        expect(libInfo.length).to.be(2);
    });
});

describe("resource-copy-plugin-3", function() {
    it("=> html mode usage with copy-webpack-plugin with attributes", function() {
        let distHtml = path.join(TEST, 'dist/resource-copy-plugin-3/index.html'),
                resultHtml = path.join(TEST, 'result/resource-copy-plugin-3/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-copy-plugin-3/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let folder = path.join(TEST, 'dist/resource-copy-plugin-3'),
            folderInfo = fs.readdirSync(folder);
        expect(folderInfo).to.eql([ 'css', 'index.html', 'js', 'libs', 'manifest.json' ]);

        let libFolder = path.join(TEST, 'dist/resource-copy-plugin-3/libs'),
            libInfo = fs.readdirSync(libFolder);
        expect(libInfo.length).to.be(3);
    });
});

describe("resource-external-1", function() {
    it("=> external resource", function() {
        let distHtml = path.join(TEST, 'dist/resource-external-1/index.html'),
                resultHtml = path.join(TEST, 'result/resource-external-1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-external-1/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);
    });
});

describe("image-in-html", function() {
    it("=> image in html", function() {
      
        let distHtml = path.join(TEST, 'dist/image-in-html/index.html'),
                resultHtml = path.join(TEST, 'result/image-in-html/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/image-in-html/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            let newKey = file.split(path.sep).join('/'); // compatible with windows path sep
            resultContent = resultContent.replace("[" + newKey + "]", assets[file]);
        });

        let stats = fs.readdirSync(path.join(TEST, 'dist/image-in-html/img'));

        let checkImage = false;

        if (stats.length) {
            let images = stats[0];
        
            if (!!~distContent.indexOf(images)) {
                checkImage = true;
            }
        }

        expect(true).to.be(distContent === resultContent && checkImage);
    });
});

describe("resource-attr-1", function() {
    it("=> resource atribute", function() {
        let distHtml = path.join(TEST, 'dist/resource-attr-1/index.html'),
                resultHtml = path.join(TEST, 'result/resource-attr-1/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-attr-1/manifest.json'), "utf-8") || "");

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-remove", function() {
    it("=> resource remove", function() {
        let distHtml = path.join(TEST, 'dist/resource-remove/html/entry.html'),
                resultHtml = path.join(TEST, 'result/resource-remove/index.html');

        let distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-production", function() {
    it("=> production environment", function() {
        var distHtml = path.join(TEST, 'dist/resource-production/html/entry.html'),
                resultHtml = path.join(TEST, 'result/resource-production/index.html');

        var distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);

        var distHtml = path.join(TEST, 'dist/resource-production/html/detail.html'),
                resultHtml = path.join(TEST, 'result/resource-production/detail.html');

        var distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });

    it("=> development environment", function() {
        var distHtml = path.join(TEST, 'dist/resource-production-1/html/entry.html'),
                resultHtml = path.join(TEST, 'result/resource-production-1/index.html');

        var distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);

        var distHtml = path.join(TEST, 'dist/resource-production-1/html/detail.html'),
                resultHtml = path.join(TEST, 'result/resource-production-1/detail.html');

        var distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});

describe("resource-query-hash", function() {
    it("=> query & hash", function() {
        var distHtml = path.join(TEST, 'dist/resource-query-1/html/entry.html'),
                resultHtml = path.join(TEST, 'result/resource-query-1/entry.html');

        var distContent = trimString(fs.readFileSync(distHtml, 'utf-8')),
            resultContent = trimString(fs.readFileSync(resultHtml, 'utf-8'));

        expect(true).to.be(distContent === resultContent);
    });
});