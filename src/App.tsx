import { useEffect, useState } from "react";
import "./App.css";
import { Iproduct } from "./interface";
import axios from "axios";
import { useForm } from "react-hook-form";

function App() {
  const [products, setProducts] = useState<Iproduct[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd } = useForm<Iproduct>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit } = useForm<Iproduct>();

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:3000/products`);
      const data = await response.json();
      setProducts(data);
    })();
  }, []);

  const onRemove = async (id: number) => {
    try {
      const confirm = window.confirm("Bạn có chắc muốn xóa?");
      if (confirm) {
        await fetch(`http://localhost:3000/products/${id}`, {
          method: "DELETE",
        });
        alert("Xóa thành công");
        setProducts(products.filter((pro) => pro.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCheck = (id: number) => {
    setProducts(
      products.map((pro) =>
        pro.id === id ? { ...pro, checked: !pro.checked } : pro
      )
    );
  };

  const onAddSubmit = async (product: Iproduct) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/products`,
        product
      );
      const newProduct = { ...data, status: false }; // Tạo đối tượng sản phẩm mới với thuộc tính status
      setProducts([...products, newProduct]); // Cập nhật danh sách sản phẩm
      alert("Thêm thành công");
      resetAdd();
    } catch (error) {
      console.log(error);
    }
  };

  const onEditSubmit = async (product: Iproduct) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/products/${editId}`,
        product
      );
      setProducts(products.map((pro) => (pro.id === editId ? data : pro)));
      setEditId(null);
      alert("Cập nhật thành công");
      resetEdit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-center">Danh sách công việc</h2>
          <form className="d-flex" onSubmit={handleSubmitAdd(onAddSubmit)}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Thêm sản phẩm"
              {...registerAdd("name", { required: true })}
            />
            {errorsAdd.name && (
              <div className="form-text text-danger">Không được để trống</div>
            )}
            <button type="submit" className="btn btn-primary">
              Thêm
            </button>
          </form>
        </div>

        <table className="table table-striped table-hover">
          <thead className="">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((pro: Iproduct, index) => (
              <tr key={pro.id}>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={!!pro.checked}
                    onChange={() => toggleCheck(pro.id)}
                  />
                </td>
                <td>
                  {pro.checked ? (
                    <del>{pro.name}</del>
                  ) : (
                    <>
                      {editId === pro.id ? (
                        <form className="d-flex align-items-center" onSubmit={handleSubmitEdit(onEditSubmit)}>
                          <input
                            type="text"
                            className=" me-2"
                            {...registerEdit("name", { required: true })}
                            defaultValue={pro.name}
                          />
                          <button type="submit" className="btn btn-sm btn-success me-2">Lưu</button>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Hủy</button>
                        </form>
                      ) : (
                        <span onClick={() => { setEditId(pro.id); resetEdit({ name: pro.name }); }}>{pro.name}</span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemove(pro.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
