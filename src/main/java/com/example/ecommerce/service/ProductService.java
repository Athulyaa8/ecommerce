package com.example.ecommerce.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import com.example.ecommerce.exception.ProductNotFoundException;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(String id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + id
                        ));
    }

    public void deleteProduct(String id) {

        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(
                    "Product not found with id: " + id
            );
        }

        productRepository.deleteById(id);
    }

    public Product updateProduct(String id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + id
                        ));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(existingProduct);
    }

    public List<String> getAllCategories() {
        return mongoTemplate.findDistinct(new Query(), "category", Product.class, String.class);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> filterProducts(
            Optional<String> category,
            Optional<Double> minPrice,
            Optional<Double> maxPrice) {

        List<Criteria> criteriaList = new ArrayList<>();

        Optional<String> cleanCategory = category.filter(c -> !c.trim().isEmpty());
        if (cleanCategory.isPresent()) {
            criteriaList.add(
                    Criteria.where("category")
                            .regex("^" + Pattern.quote(cleanCategory.get().trim()) + "$", "i")
            );
        }

        if (minPrice.isPresent()) {
            criteriaList.add(
                    Criteria.where("price")
                            .gte(minPrice.get())
            );
        }

        if (maxPrice.isPresent()) {
            criteriaList.add(
                    Criteria.where("price")
                            .lte(maxPrice.get())
            );
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query = new Query(
                    new Criteria()
                            .andOperator(
                                    criteriaList.toArray(new Criteria[0])
                            )
            );
        }

        return mongoTemplate.find(query, Product.class);
    }

    public Page<Product> getFilteredProducts(
            Optional<String> search,
            Optional<String> category,
            Optional<Double> minPrice,
            Optional<Double> maxPrice,
            Pageable pageable) {

        List<Criteria> criteriaList = new ArrayList<>();

        Optional<String> cleanSearch = search.filter(s -> !s.trim().isEmpty());
        if (cleanSearch.isPresent()) {
            criteriaList.add(
                    Criteria.where("name")
                            .regex(Pattern.quote(cleanSearch.get().trim()), "i")
            );
        }

        Optional<String> cleanCategory = category.filter(c -> !c.trim().isEmpty());
        if (cleanCategory.isPresent()) {
            criteriaList.add(
                    Criteria.where("category")
                            .regex("^" + Pattern.quote(cleanCategory.get().trim()) + "$", "i")
            );
        }

        if (minPrice.isPresent()) {
            criteriaList.add(
                    Criteria.where("price")
                            .gte(minPrice.get())
            );
        }

        if (maxPrice.isPresent()) {
            criteriaList.add(
                    Criteria.where("price")
                            .lte(maxPrice.get())
            );
        }

        // Query for total count
        Query countQuery = new Query();

        if (!criteriaList.isEmpty()) {
            countQuery = new Query(
                    new Criteria()
                            .andOperator(
                                    criteriaList.toArray(new Criteria[0])
                            )
            );
        }

        long total = mongoTemplate.count(
                countQuery,
                Product.class
        );

        // Apply pagination
        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query = new Query(
                    new Criteria()
                            .andOperator(
                                    criteriaList.toArray(new Criteria[0])
                            )
            );
        }

        query.with(pageable);

        List<Product> products =
                mongoTemplate.find(query, Product.class);

        return PageableExecutionUtils.getPage(
                products,
                pageable,
                () -> total
        );
    }
}