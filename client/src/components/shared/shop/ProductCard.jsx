import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Rating } from "@mui/material";
const ProductCard = ({ id, colors, price, rating, imageUrl, title }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="mb-10 hover:shadow-xl duration-500 cursor-pointer"
      onClick={() => navigate("/product/" + id)}
    >
      <CardHeader color="blue-gray" className="relative h-56">
        <img src={imageUrl} alt="product-image" />
      </CardHeader>
      <CardBody className="mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-5">
          {colors.map(({ color, label }, index) => (
            <Tooltip key={index} content={label}>
              <Button
                size="sm"
                className="rounded-full"
                style={{ backgroundColor: color }}
              >
                {""}
              </Button>
            </Tooltip>
          ))}
        </div>
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        <div className="mx-auto text-center">
          <Rating value={rating} readOnly />
        </div>
        <div className="flex items-center gap-4">
          <Typography variant="h6" color="blue-gray" className=" text-center">
            {price.toLocaleString("en-US")}đ
          </Typography>
          <Chip color="blue-gray" value={"-" + 15 + "%"} />
          <Typography
            variant="small"
            color="gray"
            className="line-through text-center opacity-50"
          >
            {price.toLocaleString("en-US")}đ
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  price: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
export default ProductCard;