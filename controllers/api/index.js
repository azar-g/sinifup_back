export default async function index(body, success, error) {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  success(data);
}
