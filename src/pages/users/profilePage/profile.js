import React from "react";
import "./profileStyle.scss";
import imgProfile from "../../../assets/users/anhdaidien.jpg";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  return (
    <>
      <div class="container emp-profile">
        <form method="post">
          <div class="row">
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
              <div className="profile-img">
                <img src={imgProfile} alt="Ảnh đại diện" />
                <div className="file btn btn-lg btn-primary">
                  Thay đổi ảnh
                  <input type="file" name="file" />
                </div>
              </div>
              <div className="col-md-9 d-flex justify-content-around align-items-center">
                <Link
                  to="https://github.com/tungnguyen0408?tab=repositories"
                  target="_blank"
                  className="btn btn-outline-dark btn-rounded btn-sm rounded-pill"
                >
                  Github Link
                </Link>
                <Link
                  to="https://github.com/tungnguyen0408?tab=repositories"
                  className="btn btn-outline-dark btn-rounded btn-sm rounded-pill"
                >
                  API docs
                </Link>
                <Link
                  to="https://github.com/tungnguyen0408?tab=repositories"
                  className="btn btn-outline-dark btn-rounded btn-sm rounded-pill"
                >
                  PDF file
                </Link>
              </div>
            </div>
            <div class="col-md-6">
              <div class="profile-head">
                <h4>Thông tin cá nhân</h4>
                <p class="university">
                  HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                </p>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      href="#home"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Về bản thân
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#profile"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                      style={{ color: "#000" }}
                    >
                      Thông tin khác
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md-12">
                <div class="tab-content profile-tab" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <div class="row">
                      <div class="col-md-6">
                        <label>Họ và tên: </label>
                      </div>
                      <div class="col-md-6">
                        <p>Nguyễn Văn Tùng</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Mã sinh viên: </label>
                      </div>
                      <div class="col-md-6">
                        <p>B21DCPT230</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Email</label>
                      </div>
                      <div class="col-md-6">
                        <p>tungnguyen0408@gmail.com</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Điện thoại</label>
                      </div>
                      <div class="col-md-6">
                        <p>123 456 7890</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Lĩnh vực: </label>
                      </div>
                      <div class="col-md-6">
                        <p>Phát triển Web</p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    <div class="row">
                      <div class="col-md-6">
                        <label>Experience</label>
                      </div>
                      <div class="col-md-6">
                        <p>Expert</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Hourly Rate</label>
                      </div>
                      <div class="col-md-6">
                        <p>10$/hr</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Total Projects</label>
                      </div>
                      <div class="col-md-6">
                        <p>230</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>English Level</label>
                      </div>
                      <div class="col-md-6">
                        <p>Expert</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <label>Availability</label>
                      </div>
                      <div class="col-md-6">
                        <p>6 months</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <label>Your Bio</label>
                        <br />
                        <p>Your detail description</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="col-md-2">
              <input
                type="submit"
                class="profile-edit-btn"
                name="btnAddMore"
                value="Sửa thông tin"
              />
            </div> */}
          </div>
          <div class="row"></div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
