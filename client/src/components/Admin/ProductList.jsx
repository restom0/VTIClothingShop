import {
  Button,
  Card,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
  Dialog,
  Tooltip,
  Input,
  Textarea,
  Radio,
  Select,
  Option,
} from "@material-tailwind/react";
import { Container, Rating } from "@mui/material";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../configs/swiper.css";
import AdminLayout from "../../layouts/Admin/AdminLayout";
import { productdetail } from "../../constants/table_head";
import CloseIcon from "@mui/icons-material/Close";
const ProductList = () => {
  const [active, setActive] = React.useState(1);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const product = {
    id: 0,
    colors: [
      { color: "#aaaaaa", label: "Màu xám" },
      { color: "#ffffaa", label: "Màu vàng" },
      { color: "#012345", label: "Màu xanh" },
      { color: "#777777", label: "Màu xám đen" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["Cotton", "Vải len"],
    price: 155000,
    rating: 4.0,
    imageUrl: [
      "https://www.material-tailwind.com/image/product-4.png",
      "https://www.material-tailwind.com/image/product-4.png",
      "https://www.material-tailwind.com/image/product-4.png",
      "https://www.material-tailwind.com/image/product-4.png",
    ],
    title: "Abisko Trail Stretch Trousers M",
    description: `The key to more success is to have a lot of pillows. Put it this way, it took me twenty five years to get these plants, twenty five years of blood sweat and tears, and I'm never giving up, I'm just getting started. I'm up to something. Fan luv.`,
    short_description: `As we live, our hearts turn colder.`,
  };
  const TABLE_ROWS = [
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
  ];
  return (
    <>
      <AdminLayout
        name="Danh sách sản phẩm"
        TABLE_HEAD={productdetail}
        TABLE_ROWS={TABLE_ROWS}
        active={active}
        setActive={setActive}
        deleteContent="Xóa sản phẩm"
        updateContent="Chỉnh sửa sản phẩm"
        size="xl"
        headerDetail={"Chi tiết sản phẩm #" + "001"}
        bodyDetail={
          <section className="px-8 h-[65vh] overflow-auto">
            <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2">
              <div className="grid-cols-1 ">
                <div className="h-[300px] w-96 mx-auto">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    modules={[Navigation]}
                    className="mySwiper1 h-[300px] w-[500px]"
                  >
                    {product.imageUrl.map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* <img
              src="https://www.material-tailwind.com/image/product-4.png"
              alt="pink blazer"
              className=""
            /> */}
                <div className="h-[100px] w-[400px]">
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    modules={[Navigation]}
                    loop={true}
                    className="mySwiper mt-10"
                  >
                    {product.imageUrl.map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="grid grid-cols-2 text-center mt-5">
                  <Typography variant="h6">Giá nhập:</Typography>
                  <Typography variant="small">$1,490</Typography>
                  <Typography variant="h6">Giá bán:</Typography>
                  <Typography variant="small">$1,490</Typography>
                  <Typography variant="h6">Giảm giá:</Typography>
                  <Typography variant="small">10%</Typography>
                </div>
              </div>
              <div>
                <Typography className="mb-4" variant="h3">
                  {product.title}
                </Typography>
                <div className="grid grid-cols-2 text-center mt-5">
                  <Typography variant="h6">Thương hiệu:</Typography>
                  <Typography variant="small">Nike</Typography>
                  <Typography variant="h6">Danh mục:</Typography>
                  <Typography variant="small">Quần áo</Typography>
                </div>
                <Typography className="!mt-4 text-base font-bold leading-[27px] !text-gray-700">
                  Mô tả
                </Typography>
                <Typography className="!mt-4 text-base font-normal leading-[27px] !text-gray-500">
                  {product.short_description}
                </Typography>
                <div className="my-8 flex items-center gap-2">
                  <Rating
                    readOnly
                    value={product.rating}
                    className="disabled text-amber-500"
                  />
                  <Typography className="!text-sm font-bold !text-gray-700">
                    {product.rating.toPrecision(2)}/5 (100 reviews)
                  </Typography>
                </div>
                <div className="grid grid-cols-4  text-center">
                  <Typography
                    color="blue-gray"
                    variant="h6"
                    className="col-span-2"
                  >
                    Màu sắc
                  </Typography>
                  <Typography color="blue-gray" variant="h6">
                    Kích cỡ
                  </Typography>
                  <Typography color="blue-gray" variant="h6">
                    Chất liệu
                  </Typography>
                  <div className="my-4 mt-3 flex flex-col gap-2 col-span-2">
                    {product.colors.map((color, index) => (
                      <div className="flex gap-2 items-center ms-5" key={index}>
                        <Button
                          size="lg"
                          variant="gradient"
                          color="white"
                          className="rounded-full"
                          style={{ backgroundColor: color.color }}
                        >
                          {" "}
                        </Button>
                        <Typography>{color.label}</Typography>
                      </div>
                    ))}
                  </div>

                  <div className="my-8 mt-3 flex flex-col gap-2">
                    {product.sizes.map((size, index) => (
                      <Typography
                        key={index}
                        className="!text-gray-700 text-center"
                      >
                        {size}
                      </Typography>
                    ))}
                  </div>
                  <div className="my-8 mt-3 flex flex-col gap-2">
                    {product.materials.map((material, index) => (
                      <Typography
                        key={index}
                        className="!text-gray-700 text-center"
                      >
                        {material}
                      </Typography>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <Dialog open={open} handler={handleOpen}>
                    <DialogHeader className="pb-0 flex justify-between">
                      <Typography variant="h4">Nhập giá sản phẩm</Typography>
                      <IconButton
                        className="border-none"
                        variant="outlined"
                        onClick={handleOpen}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogHeader>
                    <DialogBody>
                      The key to more success is to have a lot of pillows. Put
                      it this way, it took me twenty five years to get these
                      plants, twenty five years of blood sweat and tears, and
                      I&apos;m never giving up, I&apos;m just getting started.
                      I&apos;m up to something. Fan luv.
                    </DialogBody>
                    <DialogFooter>
                      <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                      >
                        <span>Cancel</span>
                      </Button>
                      <Button
                        variant="gradient"
                        color="green"
                        onClick={handleOpen}
                      >
                        <span>Confirm</span>
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </div>
              </div>
            </div>
          </section>
        }
        headerUpdate={"Chỉnh sửa sản phẩm #" + "001"}
        bodyUpdate={
          <Container>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold my-auto"
              >
                Tên sản phẩm:
              </Typography>
              <Input
                value={"Nike"}
                placeholder="Nike"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold my-auto"
              >
                Tên thương hiệu:
              </Typography>
              <Select
                value="Nike"
                className=" !border-blue-gray-200 focus:!border-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              >
                <Option value="Nike">Nike</Option>
                <Option value="Adidas">Adidas</Option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold my-auto"
              >
                Tên danh mục:
              </Typography>
              <Select
                value="Nike"
                className=" !border-blue-gray-200 focus:!border-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              >
                <Option value="Nike">Nike</Option>
                <Option value="Adidas">Adidas</Option>
              </Select>
            </div>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Mô tả:
            </Typography>
            <Textarea
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={"Thương hiệu thể thao hàng đầu thế giới"}
              placeholder="Thương hiệu thể thao hàng đầu thế giới"
            />
          </Container>
        }
      >
        <div className="flex items-center justify-between gap-4">
          <Button className=" !border-gray-300" color="gray" variant="outlined">
            Thêm mới
          </Button>
        </div>
      </AdminLayout>
      {/* <Container className="mt-5">
        <div className="flex items-center justify-between mb-5">
          <Typography variant="h3" color="blue-gray" className="font-bold">
            Danh sách sản phẩm
          </Typography>
          <div className="flex items-center justify-between gap-4">
            <Button
              className=" !border-gray-300"
              color="gray"
              variant="outlined"
            >
              Thêm mới
            </Button>
          </div>
        </div>
        <Table
          TABLE_HEAD={productdetail}
          TABLE_ROWS={TABLE_ROWS}
          active={active}
          setActive={setActive}
          handleDetailOpen={handleDetailOpen}
          handleUpdateOpen={handleUpdateOpen}
          handleDeleteOpen={handleDeleteOpen}
          deleteContent="Xóa sản phẩm"
          updateContent="Chỉnh sửa sản phẩm"
        />
      </Container>
      <Dialog open={detailOpen} handler={handleDetailOpen}>
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleDetailOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleDetailOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog> */}
    </>
  );
};

export default ProductList;