import Search from "../../components/Search/Search";
import s from "./Home.module.scss";

export default function Home(params) {
  return (
    <>
      <section className={s["welcome"]}>
        <div
          className={`d-flex ${s["start-image"]} w-100 justify-content-center align-items-center`}
        >
          <div className="container text-center">
            <div className="row">
              <h1>World's Largest E-commerce Platform!</h1>
            </div>
            <div className="row">
              <h3>
              Here you will definitely find what you are looking for!
              </h3>
            </div>
            <div className="row">
              <div className="d-flex justify-content-center">
                <Search />
                {/* <form action="" className="input-group mb-3 search">
              <div className="dropdown col-12 col-md-3">
                <button id="categoryForChange" className="btn btn-white dropdown-toggle w-100" type="button" id="dropdownMenuButton2"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  Select Category
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Cars&Vehiles</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Electrics & Gedgets</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Real Estate</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Sports & Games</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Fshion & Beauty</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Pets & Animals</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Home Appliances</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Matrimony Services</a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Miscellaneous </a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Job Openings </a>
                  </li>
                  <li>
                    <a className="my-dropdown-item" onclick="changeCategory(event)">Books & Magazines</a>
                  </li>
                </ul>
              </div>
              <input type="text" className="form-control col-12 col-md" aria-label="Text input with dropdown button"
                placeholder="Type Your key word" />
              <button className="btn btn-green col-12 col-md-2" type="submit">
                SEARCH
              </button>
            </form> */}
              </div>
            </div>
            <div className="row">
              {/* <div className="d-flex col-12 justify-content-center flex-wrap soc-network">
            <a href="#">
              <div id="facebook-icon" title="Facebook"></div>
            </a>
            <a href="#">
              <div id="twit-icon" title="Twitter"></div>
            </a>
            <a href="#">
              <div id="google-icon" title="Google +"></div>
            </a>
            <a href="#">
              <div id="youtube-icon" title="Youtube"></div>
            </a>
          </div> */}
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        {/* <section id="ads">
      <div className="white-block additional-info">
        <div className="row info-text">
          <div className="col-12 col-md-4 text-center about">
            <img src="images/imprint.png" alt="image"/>
            <h4>Secure Trading</h4>
            <p>
              Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie
            </p>
          </div>
          <div className="col-12 col-md-4 text-center about">
            <img src="images/phone.png" alt="image"/>
            <h4>Secure Trading</h4>
            <p>
              Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit
            </p>
          </div>
          <div className="col-12 col-md-4 text-center about">
            <img src="images/money.png" alt="image"/>
            <h4>Secure Trading</h4>
            <p>
              Mirum est notare quam littera gothica, quam nunc putamus parum claram
            </p>
          </div>
        </div>
        </div>
    </section> */}
      </div>
      <nav className={s["post-rek"]}>
        <div className={`d-flex ${s["background"]}`}>
          <div className="container text-center">
            <h2 className="">
              Our sales platform is one of the best platforms!
            </h2>
            <h4 className="">Developers' words</h4>
            {/* <a classNameName={`btn ${s["btn"]} ${s["btn-green"]}`}>Post Your Ad</a> */}
          </div>
        </div>
      </nav>
    </>
  );
}
