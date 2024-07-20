package vn.vti.clothing_shop.dtos.outs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InputSaleDTO {
    private Long id;
    private String filter;
    private Long filter_id;
    private Float salePercentage;
    private Float discount;
    private String available_date;
    private String end_date;
    List<OnSaleProductDTO> onSaleProducts;
}