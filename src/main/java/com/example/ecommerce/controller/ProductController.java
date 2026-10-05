package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping
    public Page<Product> getAllProducts(
            @RequestParam(required = false) Optional<String> search,
            @RequestParam(required = false) Optional<String> category,
            @RequestParam(required = false) Optional<Double> minPrice,
            @RequestParam(required = false) Optional<Double> maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String sort) {

        String[] sortParts = sort.split(",");
        if (sortParts.length != 2) {
            sortParts = new String[]{"name", "asc"};
        }

        String sortField = sortParts[0];
        if (!List.of("name", "price", "stock", "category").contains(sortField)) {
            sortField = "name";
        }

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortParts[1]);
        } catch (IllegalArgumentException e) {
            direction = Sort.Direction.ASC;
        }

        Sort sortBy = Sort.by(direction, sortField);

        if (size > 100) {
            size = 100;
        }

        return productService.getFilteredProducts(
                search, category, minPrice, maxPrice,
                PageRequest.of(page, size, sortBy));
    }

    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return productService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchByName(name);
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return productService.getByCategory(category);
    }

    @GetMapping("/filter")
    public List<Product> filterProducts(
            @RequestParam(required = false) Optional<String> category,
            @RequestParam(required = false) Optional<Double> minPrice,
            @RequestParam(required = false) Optional<Double> maxPrice) {

        return productService.filterProducts(category, minPrice, maxPrice);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return Map.of("message", "Product deleted successfully");
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable String id,
            @Valid @RequestBody Product product) {

        return productService.updateProduct(id, product);
    }
}