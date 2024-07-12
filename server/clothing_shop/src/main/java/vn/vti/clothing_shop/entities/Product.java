package vn.vti.clothing_shop.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`product`")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name",unique = true,nullable = false)
    private String name;

    @Column(name= "short_description")
    private String short_description;

    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "slider_url_1")
    private String slider_url_1;

    @Column(name = "slider_url_2")
    private String slider_url_2;

    @Column(name = "slider_url_3")
    private String slider_url_3;

    @Column(name = "slider_url_4")
    private String slider_url_4;

    @ManyToOne
    @JoinColumn(name = "category_id",referencedColumnName = "id")
    private Category category_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand_id;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

}
//Table products {
//id integer [pk]
//name string
//short_description string
//image_url string
//category_id integer [ref: < categories.id]
//brand_id integer [ref: < brands.id]
//created_at timestamp
//updated_at timestamp
//deleted_at timestamp
//}