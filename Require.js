// Waits for javascsript/css file from string path $path to load and add to page
// Must be awaited upon, type is either "css" or "js"
const require = async(path, type) => {
    // Fetch the script
    const response = await fetch(path);
    if (!response.ok) 
        return false;
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
    else return false;
    // Append it to the head to make it active
    document.head.appendChild(elem);
    // Create a promise we can use to wait until the script is loaded
    const loadedPromise = new Promise((resolve) => {
        // When loaded resolve the promise and return to caller
        elem.onload = ()=>resolve();
    });
    // Wait for script to load
    await loadedPromise;
}
