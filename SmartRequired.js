// Array of requested libraries
libs = [];
const Library = class {
    constructor(path, type) {
        this.path = path;
        this.type = type;
        // Promise used for external calling
        this.promise = new Promise((resolve) => {
            // Can call lib.resolve() externally
            this.resolve = resolve;
        });
    }
}
// Waits for javascsript/css file from string path $path to load and add to page
// Must be awaited upon, type is either "css" or "js"
const require = async(path, type) => {
    // See if we already have library queued
    let p = null;
    for (let i = 0; i < libs.length; i++) {
        if (libs[i].path == path) {
            p = libs[i].promise;
            break;
        }
    }
    if (p) {
        // If we do, await its promise
        await p;
        return 0;
    }
    const lib = new Library(path, type);
    libs.push(lib);
    // Fetch the script
    const response = await fetch(path, {mode: 'no-cors'});
    if (!response.ok) {
        console.log(response.status)
        return 2;
    }
    // Await the blob
    const blob = await response.blob(); 
    const objectURL = URL.createObjectURL(blob);
    let elem;
    if (type == "js") {
        // Create script element 
        elem = document.createElement("script");
        elem.setAttribute("src", objectURL); 
        elem.setAttribute("type", "text/javascript"); 
    }
    else if (type == "css") {
        // Create css element
        elem = document.createElement("link");
        elem.setAttribute("rel", "stylesheet");
        elem.setAttribute("href", objectURL); 
    }
    else return 3;
    // Append it to the head to make it active
    document.head.appendChild(elem);
    // Create a promise we can use to wait until the script is loaded
    const loadedPromise = new Promise((resolve) => {
        // When loaded resolve the promise and return to caller
        elem.onload = ()=>resolve();
    });
    // Wait for script to load
    await loadedPromise;
    // Resolve the library
    lib.resolve();
    return 0;
}
