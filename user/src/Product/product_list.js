import React, { useEffect, useState } from "react";
import { useServicesHook } from "../Hooks/serviceHooks";
import './product_list.css';

const ProductList = () => {
    const { getProducts } = useServicesHook();
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [getProducts]);

    const renderDetailValue = (key, value) => {
        if (Array.isArray(value)) {
            return <div><strong>{key}:</strong> {value.join(", ")}</div>;
        } else if (typeof value === "object" && value !== null) {
            return (
                <div>
                    <strong>{key}:</strong>
                    <ul>
                        {Object.keys(value).map((subKey, index) => (
                            <li key={index}>
                                <strong>{subKey}:</strong> {Array.isArray(value[subKey]) ? value[subKey].join(", ") : value[subKey]}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return <div><strong>{key}:</strong> {value.toString()}</div>;
        }
    };

    if (!products) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-list">
            {Object.keys(products).map((category) => (
                <div key={category} className="category-section">
                    <h2 className="category-header">{category}</h2>
                    <div className="product-cards">
                        {Array.isArray(products[category]) && products[category].map((item, index) => (
                            <div key={index} className="product-card">
                                <h3 className="product-name">{item.name}</h3>
                                <div className="product-details">
                                    {Object.keys(item.details).map((detailKey) => (
                                        <div key={detailKey}>
                                            {renderDetailValue(detailKey, item.details[detailKey])}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
