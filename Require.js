// Waits for javascsript file from path $s to load and adds it to the page
// Must be awaited for
const require = async(s) => {
    // Fetch the script
    const response = await fetch(s);
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
    let promiseResolve;
    const loadedPromise = new Promise((resolve) => {
        // We will call this externally
        promiseResolve = resolve;
    });
    // When loaded resolve the promise and return to caller
    sc.onload = promiseResolve;
    // Wait for script to load
    await loadedPromise;
}
