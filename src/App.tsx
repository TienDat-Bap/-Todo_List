import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const onRemove = (id: number) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa?");
    if (confirm) {
      fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(
          () => (
            alert("xoa thanh cong"),
            setProducts(products.filter((product) => product.id !== id))
          )
        );
    }
  };
  const onAdd = (product:any)=>{
    fetch(`http://localhost:3000/products`,{
      method:"POST",
      headers:{
        "Content-Type":"aplication/json"  
      },
      body:JSON.stringify(product)
    }).then(res=>res.json()).then((newProduct)=>(setProducts([...products,newProduct])))
  }

  return (
    <div className="container">
      {products.map((product) => (
        <div className="" key={product.id}>
          <h1>{product.name}</h1>
          <button
            className="btn btn-danger"
            onClick={() => onRemove(product.id)}
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
