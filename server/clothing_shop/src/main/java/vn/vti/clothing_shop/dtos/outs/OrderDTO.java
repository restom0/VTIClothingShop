package vn.vti.clothing_shop.dtos.outs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.vti.clothing_shop.constants.PaymentMethod;
import vn.vti.clothing_shop.constants.PaymentStatus;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String address;
    private String phone_number;
    private String receiver_name;
    private boolean isPresent;
    private PaymentStatus payment_status;
    private PaymentMethod payment_method;
    private VoucherDTO voucherId;
    private List<OrderItemDTO> orderItems;
}
