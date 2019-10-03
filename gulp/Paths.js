module.exports = class Paths {
    constructor(paths) {
        this.dirType;
        this.fileType;
        this.extension;

        this.paths = paths;
    }

    setDirType(dirType) {
        this.dirType = dirType;
        return this;
    }

    setFileType(fileType) {
        this.fileType = fileType;
        return this;
    }

    setExtension(extension) {
        this.extension = extension;
        return this;
    }

    toString() {
        const fileType = (this.fileType.length > 0) ? this.fileType + "/" : '';

        return this.paths[this.dirType] + fileType + this.extension;
    }
};