package org.example.restaurantbooksystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RestaurantBookSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurantBookSystemApplication.class, args);
    }

}
