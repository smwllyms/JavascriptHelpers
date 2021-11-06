// Waits for javascsript file from string path $path to load and add to page
// Must be awaited upon
const require = async(path) => {
    // Fetch the script
    const response = await fetch(path);
    if (!response.ok) 
        return false;
    // Await the blob
    const blob = await response.blob(); 
    const objectURL = URL.createObjectURL(blob);
    // Create script element 
    const sc = document.createElement("script");
    sc.setAttribute("src", objectURL); 
    sc.setAttribute("type", "text/javascript"); 
    // Append it to the head to make it active
    document.head.appendChild(sc);
    // Create a promise we can use to wait until the script is loaded
    const loadedPromise = new Promise((resolve) => {
        // When loaded resolve the promise and return to caller
        sc.onload = resolve;
    });
    // Wait for script to load
    await loadedPromise;
}
