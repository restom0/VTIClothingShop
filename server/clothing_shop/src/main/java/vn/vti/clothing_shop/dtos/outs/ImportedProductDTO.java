package vn.vti.clothing_shop.dtos.outs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.vti.clothing_shop.constants.ClothGender;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImportedProductDTO {
    private Long id;
    private ProductDTO product_id;
    private Integer importNumber;
    private SizeDTO size_id;
    private ColorDTO color_id;
    private MaterialDTO material_id;
    private String imageUrl;
    private String slider_url_1;
    private String slider_url_2;
    private String slider_url_3;
    private String slider_url_4;
    private String sku;
    private ClothGender gender;
    private Integer importPrice;
    private Integer stock;
}