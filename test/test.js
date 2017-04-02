"use strict";

const path = require('path'),
    expect = require('expect.js'),
	  fs = require('fs-extra');


describe("resource-dev", function() {
  	it.only("=> dev environment && custom html path", function() {
  		let distHtml = path.resolve('specWebpack/dist/resource-dev/html/entry.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-dev/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();
        
    	expect(true).to.be(distContent === resultContent);
  	});
});

describe("resource-dev1", function() {
    it("=> html mode dev environment && custom html path", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-dev1/html/entry.html'),
        resultHtml = path.resolve('specWebpack/result/resource-dev1/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});


describe("resource-inline-1", function() {
	it("=> inline without compression", function() {
    	let distHtml = path.resolve('specWebpack/dist/resource-inline-1/index.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-inline-1/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

        let folder = fs.readdirSync('specWebpack/dist/resource-inline-1/');

        expect(folder.length).toBe(1);
        expect(folder[0]).toBe('index.html');

    	expect(true).toBe(distContent === resultContent);
  	});
});

describe("resource-inline-2", function() {
	it("=> inline with compression", function() {
    	let distHtml = path.resolve('specWebpack/dist/resource-inline-2/index.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-inline-2/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

        let folder = fs.readdirSync('specWebpack/dist/resource-inline-2/');

        expect(folder.length).toBe(1);
        expect(folder[0]).toBe('index.html');

    	expect(true).toBe(distContent === resultContent);
  	});
});

describe("resource-inline-3", function() {
  it("=> html mode inline with compression", function() {
        let distHtml = path.resolve('specWebpack/dist/resource-inline-3/index.html'),
            resultHtml = path.resolve('specWebpack/result/resource-inline-3/index.html');

        let distContent = fs.readFileSync(distHtml).toString(),
            resultContent = fs.readFileSync(resultHtml).toString();

        let folder = fs.readdirSync('specWebpack/dist/resource-inline-3/');
        
        expect(folder.length).toBe(3);
        expect(folder[0]).toBe('detail.html');
        expect(folder[1]).toBe('index.html');

        expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-md5-1", function() {
  	it("=> md5 with compression / index chunk before react", function() {
    	let distHtml = path.resolve('specWebpack/dist/resource-md5-1/index.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-md5-1/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

    	expect(true).toBe(distContent === resultContent);
  	});
});

describe("resource-md5-2", function() {
  	it("=> md5 without compression  / react chunk before index", function() {
    	let distHtml = path.resolve('specWebpack/dist/resource-md5-2/index.html'),
  			resultHtml = path.resolve('specWebpack/result/resource-md5-2/index.html');

  		let distContent = fs.readFileSync(distHtml).toString(),
  			resultContent = fs.readFileSync(resultHtml).toString();

    	expect(true).toBe(distContent === resultContent);
  	});
});

describe("resource-md5-3", function() {
    it("=> html mode md5 without compression  / react chunk before index", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-md5-3/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-md5-3/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-md5-4", function() {
    it("=> html mode md5 with compression", function() {
      let distHtml = path.resolve('specWebpack/dist/resource-md5-4/index.html'),
        resultHtml = path.resolve('specWebpack/result/resource-md5-4/index.html');

      let distContent = fs.readFileSync(distHtml).toString(),
        resultContent = fs.readFileSync(resultHtml).toString();

      expect(true).toBe(distContent === resultContent);
    });
});

describe("resource-favico", function() {
  	it("=> generate favicon", function() {
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