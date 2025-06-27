// materials.service.ts
import { Injectable } from '@angular/core';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  categories: string[] = [
    'Metal',
    'Wood',
    'Fabric',
    'Plastic',
    'Stone',
    'Elastomer',
    'Ceramic',
    'Composite',
    'Construction',
    'Other', // Add 'Other' as an option
  ];

  private defaultMaterials = [
    {
      id: 1,
      name: 'Copper',
      category: 'Metal',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI0x6tfoluh5Hr34K9mheSAAHqHPcjHxKaIzFI0UxZOXuDoMGhpmMztgP5rPCMjDtRJ24&usqp=CAU',
      desc: 'A reddish-brown metal with excellent electrical conductivity, used in wiring and electronics.',
      price: 8.5,
      priceUnit: 'kg',
    },
    {
      id: 2,
      name: 'Aluminum',
      category: 'Metal',
      image:
        'https://www.scrapware.com/wp-content/uploads/2020/08/recycled-cans-1-1024x710.jpg',
      desc: 'A lightweight, corrosion-resistant metal used in cans, aircraft, and construction.',
      price: 2.2,
      priceUnit: 'kg',
    },
    {
      id: 3,
      name: 'Stainless Steel',
      category: 'Metal',
      image: 'https://www.anis-trend.com/wp-content/uploads/2021/11/metal.jpg',
      desc: 'A durable, rust-resistant alloy used in appliances, cutlery, and medical tools.',
      price: 3.75,
      priceUnit: 'kg',
    },
    {
      id: 4,
      name: 'Pine Wood',
      category: 'Wood',
      image:
        'https://www.forestinnovationhubs.rosewood-network.eu/sites/default/files/bp/multimedia/main_pics/rilegno_product_pics_2.jpg',
      desc: 'A soft, affordable wood commonly used in furniture and framing.',
      price: 12.99,
      priceUnit: 'm²',
    },
    {
      id: 5,
      name: 'Oak Wood',
      category: 'Wood',
      image:
        'https://cdn.ca.emap.com/wp-content/uploads/sites/6/2021/05/wood.jpg',
      desc: 'A strong, hardwood known for its durability in flooring and cabinetry.',
      price: 24.5,
      priceUnit: 'm²',
    },
    {
      id: 6,
      name: 'Bamboo',
      category: 'Wood',
      image:
        'https://magazin.tu-braunschweig.de/wp-content/uploads/2024/02/joshua-hoehne-XG9mXns-340-unsplash1-1200x800.jpg',
      desc: 'A fast-growing, sustainable material used in flooring and eco-friendly products.',
      price: 18.75,
      priceUnit: 'm²',
    },
    {
      id: 7,
      name: 'Cotton',
      category: 'Fabric',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQomN6jzDq0wJORXxU2LuiK0BcGnoPuOk9oaByRU3XgLnpNzd8MFirDJ8T38mX51YFtJTs&usqp=CAU',
      desc: 'A natural, breathable fiber used in clothing, towels, and bedding.',
      price: 5.99,
      priceUnit: 'm²',
    },
    {
      id: 8,
      name: 'Silk',
      category: 'Fabric',
      image:
        'https://ecostore.com/media/magefan_blog/Recycled_Fabrics_1200.jpg',
      desc: 'A luxurious, smooth fabric produced by silkworms, used in high-end garments.',
      price: 45.0,
      priceUnit: 'm²',
    },
    {
      id: 9,
      name: 'Polyester',
      category: 'Fabric',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLqWmHEWShidjgPd8l3qObtyTnIjW3v654Zpsm8WDqNFyRK3gH0Fyqv6bohZbSp2PzKF4&usqp=CAU',
      desc: 'A synthetic, wrinkle-resistant fabric often blended with cotton.',
      price: 3.25,
      priceUnit: 'm²',
    },
    {
      id: 10,
      name: 'Polycarbonate',
      category: 'Plastic',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa54WWMgvfkrawzzRgQc6UZac9B6ZbblQ2NUtgVgr_l3jXygKLXzVytuBz5Yd7s-zR3KE&usqp=CAU',
      desc: 'A tough, transparent thermoplastic used in eyewear and bulletproof glass.',
      price: 15.8,
      priceUnit: 'm²',
    },
    {
      id: 11,
      name: 'PVC',
      category: 'Plastic',
      image: 'https://live.staticflickr.com/65535/51899745895_fd7270c927_b.jpg',
      desc: 'A versatile plastic used in pipes, cables, and vinyl flooring.',
      price: 1.25,
      priceUnit: 'kg',
    },
    {
      id: 12,
      name: 'Acrylic',
      category: 'Plastic',
      image:
        'https://www.lakelandgov.net/media/10465/plastic.png?width=1437&height=1231',
      desc: 'A lightweight, shatter-resistant alternative to glass.',
      price: 22.5,
      priceUnit: 'm²',
    },
    {
      id: 13,
      name: 'Granite',
      category: 'Stone',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GOfbYKP39RlXf-qxjIeuJ5utWf75wJSIOBq4EgC0rJ4PUl6Bc_jFVj5JaHrKSXM3jHY&usqp=CAU',
      desc: 'A hard, igneous rock used in countertops and monuments.',
      price: 40.0,
      priceUnit: 'm²',
    },
    {
      id: 14,
      name: 'Marble',
      category: 'Stone',
      image:
        'https://www.stone-ideas.com/wordpress/wp-content/uploads/2015/06/Recycled-Stones15-1-2.jpg',
      desc: 'An elegant, veined stone used in sculpture and high-end architecture.',
      price: 65.0,
      priceUnit: 'm²',
    },
    {
      id: 15,
      name: 'Sandstone',
      category: 'Stone',
      image:
        'https://www.recyclingbristol.com/wp-content/uploads/Sorted-Bricks.jpg',
      desc: 'A sedimentary rock often used in building facades and paving.',
      price: 28.5,
      priceUnit: 'm²',
    },
    {
      id: 16,
      name: 'Rubber',
      category: 'Elastomer',
      image:
        'https://www.industrialrubbergoods.com/images/recycled-rubber-uses-1.jpg',
      desc: 'A flexible material used in tires, seals, and footwear.',
      price: 3.75,
      priceUnit: 'kg',
    },
    {
      id: 17,
      name: 'Glass',
      category: 'Ceramic',
      image:
        'https://res.cloudinary.com/ethicalshift/image/upload/v1673997147/recycling_ceramic_b378841e0a.png',
      desc: 'A transparent, brittle material made from silica, used in windows and bottles.',
      price: 12.0,
      priceUnit: 'm²',
    },
    {
      id: 18,
      name: 'Porcelain',
      category: 'Ceramic',
      image:
        'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fdf4a8f09-23fd-40b3-8f27-51eeb5681f8d.jpg?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1',
      desc: 'A refined ceramic used in dishware, tiles, and dental implants.',
      price: 35.0,
      priceUnit: 'm²',
    },
    {
      id: 19,
      name: 'Carbon Fiber',
      category: 'Composite',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTItYSgAavPUva4dqu-RMUp45t3WJq9-7j9Ee6evtS2CUMG8mw1piqQSv4kqhMwEBdK0g&usqp=CAU',
      desc: 'An ultra-strong, lightweight material used in aerospace and sports equipment.',
      price: 85.0,
      priceUnit: 'kg',
    },
    {
      id: 20,
      name: 'Concrete',
      category: 'Construction',
      image:
        'https://www.zters.com/blog/wp-content/uploads/2021/08/recycle-construction-materials.png',
      desc: 'A mixture of cement, sand, and aggregate used in buildings and roads.',
      price: 0.15,
      priceUnit: 'kg',
    },
  ];

  private userMaterialsKey = 'userMaterials';

  constructor() {}

  // Add this new method to get all categories
  getCategories(): string[] {
    return [...this.categories];
  }

  getDefaultMaterials(): Material[] {
    return this.defaultMaterials.map((material) => ({
      id: material.id,
      name: material.name,
      category: material.category,
      image: material.image,
      desc: material.desc,
      price: material.price,
      priceUnit: material.priceUnit,
      isUserAdded: false, // Corrected property name (was 'issUserAdded')
    }));
  }

  getUserMaterials(): Material[] {
    const storedMaterials = localStorage.getItem(this.userMaterialsKey);
    if (!storedMaterials) return [];

    try {
      return JSON.parse(storedMaterials).map((material: any) => ({
        id: material.id,
        name: material.name,
        category: material.category,
        image: material.image,
        desc: material.desc,
        price: material.price || 0, // Default to 0 if missing
        priceUnit: material.priceUnit || 'piece', // Default to 'piece' if missing
        isUserAdded: true,
      }));
    } catch (e) {
      console.error('Error parsing user materials:', e);
      return [];
    }
  }

  // Update getAllMaterials to include user-added categories
  getAllMaterials(): Material[] {
    const allMaterials = [
      ...this.getDefaultMaterials(),
      ...this.getUserMaterials(),
    ];

    // Extract unique categories from user materials that aren't in predefined categories
    const userCategories = new Set(
      this.getUserMaterials()
        .map((m) => m.category)
        .filter((cat) => !this.categories.includes(cat))
    );

    // If there are user-added categories not in our predefined list, add 'Other' if not already present
    if (userCategories.size > 0 && !this.categories.includes('Other')) {
      this.categories.push('Other');
    }

    return allMaterials;
  }

  addUserMaterial(material: Omit<Material, 'id'>): Material {
    const userMaterials = this.getUserMaterials();
    const newId =
      userMaterials.length > 0
        ? Math.max(...userMaterials.map((m: Material) => m.id)) + 1
        : 1;

    const newMaterial: Material = {
      id: newId,
      ...material,
      isUserAdded: true,
    };

    userMaterials.push(newMaterial);
    this.saveUserMaterials(userMaterials);
    return newMaterial;
  }

  updateUserMaterial(id: number, material: Omit<Material, 'id'>): boolean {
    const userMaterials = this.getUserMaterials();
    const index = userMaterials.findIndex((m: Material) => m.id === id);

    if (index !== -1) {
      userMaterials[index] = { ...material, id } as Material;
      this.saveUserMaterials(userMaterials);
      return true;
    }
    return false;
  }

  deleteUserMaterial(id: number): void {
    let userMaterials = this.getUserMaterials();
    userMaterials = userMaterials.filter((m: Material) => m.id !== id);
    this.saveUserMaterials(userMaterials);
  }

  private saveUserMaterials(materials: Material[]): void {
    localStorage.setItem(this.userMaterialsKey, JSON.stringify(materials));
  }

  // In your materials.service.ts
  getMaterialById(id: number): Material | undefined {
    return this.getAllMaterials().find((material) => material.id === id);
  }
}
