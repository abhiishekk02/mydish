import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.png";

export default function HomePage() {
  return (
    <>
      <div style={{ position: "relative", width: "90%", margin: "30px auto" }}>
        <img
          src={img1}
          alt="MyDishDB Banner"
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            // textShadow: "1px 1px 6px rgba(0, 0, 0, 0.6)",
          }}
        >
          Welcome to MyDishDB! <br /> Taste the World, One Recipe at a Time
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="h5" style={{ color: "#817B7B" }}>
              About Us
            </p>
            <p className="h5" style={{ color: "#5F76B5" }}>
              At MyDishDB, we believe that great cooking starts with the right
              recipe. Whether you’re a home cook, a food enthusiast, or a
              professional chef, our platform makes it effortless to discover,
              manage, and share recipes with ease. <br /> <br /> With a powerful
              database-driven system, we ensure that every recipe is structured,
              accurate, and easy to find. Search by ingredients, cuisine,
              cooking time, and more, then save your favorites, edit details, or
              share them with friends. <br />
              <br /> Built for simplicity and efficiency, MyDishDB is your
              one-stop destination for all things cooking—because organizing
              recipes should be as easy as making them! <br />
              <br /> Join us and start building your digital cookbook today.
            </p>
          </div>
          <div className="col-md-6 d-flex">
            <img src={img2} className="img w-50 mx-auto h-100" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
