"use strict";

const path = require('path'),
    expect = require('expect.js'),
	  fs = require('fs-extra');

const TEST = path.resolve('test');

describe("resource-dev", function() {
  	it("=> dev environment && custom html path", function() {
  		let distHtml = path.join(TEST, 'dist/resource-dev/html/entry.html'),
  			resultHtml = path.join(TEST, '/result/resource-dev/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();
        
    	expect(true).to.be(distContent === resultContent);

        let folder =  path.join(TEST, 'dist/resource-dev');
        let fileInfo = fs.readdirSync(folder);

        expect(fileInfo).to.eql([ 'css', 'html', 'js', 'libs']);
  	});
});

describe("resource-dev1", function() {
    it("=> html mode dev environment && custom html path", function() {
        let distHtml = path.join(TEST, 'dist/resource-dev1/html/entry.html'),
            resultHtml = path.join(TEST, '/result/resource-dev1/index.html');

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

        expect(true).to.be(distContent === resultContent);

        let folder =  path.join(TEST, 'dist/resource-dev1');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.eql([ 'css', 'html', 'js']);

        let jsfolder = path.join(TEST, 'dist/resource-dev1/js');
        let jsInfo = fs.readdirSync(jsfolder);
        expect(jsInfo).to.eql(['index.js', 'libs']);

    });
});


describe("resource-inline-1", function() {
	it("=> inline without compression", function() {
    	let distHtml = path.join(TEST, 'dist/resource-inline-1/index.html'),
  			resultHtml = path.join(TEST, 'result/resource-inline-1/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

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

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

        let folder =  path.join(TEST, 'dist/resource-inline-1');
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

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

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

describe("resource-md5-1", function() {
  	it("=> md5 with compression / index chunk before react", function() {
        let distHtml = path.join(TEST, 'dist/resource-md5-1/index.html'),
            resultHtml = path.join(TEST, 'result/resource-md5-1/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-1/manifest.json'), "utf-8"));

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

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-2/manifest.json'), "utf-8"));

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

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-3/manifest.json'), "utf-8"));

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

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

        let assets = JSON.parse(fs.readFileSync(path.join(TEST, 'dist/resource-md5-4/manifest.json'), "utf-8"));

        Object.keys(assets).forEach((file) => {
            resultContent = resultContent.replace("[" + file + "]", assets[file]);
        });

        expect(true).to.be(distContent === resultContent);

        let cdnFolder = path.join(TEST, 'dist/resource-md5-4/cdn'),
            cdnInfo = fs.readdirSync(cdnFolder);

        expect(cdnInfo).to.eql(['css', 'js']);
    });
});

describe("resource-favico", function() {
  	it.only("=> generate favicon", function() {
    	let distHtml = path.resolve('specWebpack/dist/resource-favico/index.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-favico/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

    	expect(true).toBe(distContent === resultContent);
  	});
});

describe("resource-favico1", function() {
    it("=> html mode generate favicon", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-favico1/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-favico1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-common-1", function() {
    it("=> common chunk generated by webpack", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-common-1/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-common-1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-common-2", function() {
    it("=> html mode common chunk generated by webpack", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-common-2/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-common-2/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-copy-plugin-1", function() {
    it("=> usage with copy-webpack-plugin", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-copy-plugin-1/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-copy-plugin-1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-copy-plugin-2", function() {
    it("=> usage with copy-webpack-plugin with attributes", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-copy-plugin-2/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-copy-plugin-2/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-copy-plugin-3", function() {
    it("=> html mode usage with copy-webpack-plugin with attributes", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-copy-plugin-3/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-copy-plugin-3/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-external-1", function() {
    it("=> external resource", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-external-1/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-external-1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("image-in-html", function() {
    it("=> image in html", function() {
      let distHtml = path.resolve('specWebpack/dist/image-in-html/index.html'),
        resultHtml = path.resolve('specWebpack/result/image-in-html/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();


      let stats = fs.readdirSync(path.resolve('specWebpack/dist/image-in-html/img'));

      let checkImage = false;

      if (stats.length) {
        let images = stats[0];
        
        if (!!~distContent.indexOf(images)) {
          checkImage = true;
        }
      }

      expect(true).toBe(distContent === resultContent && checkImage);
    });
});

describe("resource-attr-1", function() {
    it("=> resource atribute", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-attr-1/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-attr-1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});