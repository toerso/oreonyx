const path = require('path');

class File {
    constructor() {
        this.APP_ROOT_PATH = process.cwd(); //gives the current directory where it is running
    }

    file_ext(fileWithPathOrName) {
        return path.extname(fileWithPathOrName);
    }

    file_basename(fileWithPathOrName) {
        return  path.basename(fileWithPathOrName, this.file_ext(fileWithPathOrName));
    }

    relative_path(filepath) {
        return path.relative(this.APP_ROOT_PATH, filepath);
    }

    resolve_path(filepath) {
        return path.resolve(this.APP_ROOT_PATH, filepath);
    }

    extract_path(filepath, extractPart) {
        return filepath.replace(extractPart, '');
    }

    extract_src_dir(_path) {
        const regex = /(?<=.\/)(\w*)/i;
        const match = _path.match(regex);

        return match[0];
    }
}


module.exports = File;