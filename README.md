# URL Health Checker Utility  

This utility checks the health of URLs with support for concurrency and customizable configurations.  
**Requires Node.js version 22 or higher**.  

---

## Features  

- **CLI-based execution**.  
- Load a list of URLs from a `.txt` file.  
- Load configuration options from a `.json` file.  
- Controls for parallel requests using concurrency.  
- Optional verbose mode for detailed response logs or print only on condition (request failed or server response exceeded the specified maximum delay time).  

---

## Input Files  

### Example `.txt` file (URL list):  

```txt
https://jsonplaceholder.typicode.com/todos/1  
https://jsonplaceholder.typicode.com/todos/2  
https://jsonplaceholder.typicode.com/todos/3  
https://jsonplaceholder.typicode.com/todos/4  
https://jsonplaceholder.typicode.com/todos/5  
https://jsonplaceholder.typicode.com/todos/6  
```

## Configuration File  

### Example `.json` Configuration File:  

```json
{
  "config": {
    "interval": 100000,
    "maxConcurrencyRequest": 4,
    "latencyLimit": 1000
  }
}
```

### Parameter Description:
- **interval**: the interval for restarting the URL list check.
- **maxConcurrencyRequest**: the number of parallel requests.
- **latencyLimit**: the maximum server response time.

### Example CLI Command:
```bash
node ./dist/app.js -f path_to_file.txt -c path_to_file_with_config.json -v
```

- **`-v`** or **`--verbose`**: print all network responses.  
  If the `-v` flag is not specified, the response is printed only in two cases:  
  1. When the network request fails.  
  2. If the server response exceeds the `latencyLimit` value.