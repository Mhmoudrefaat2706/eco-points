import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

interface Material {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
}

@Component({
  selector: 'app-materials-details',
  imports: [NavbarComponent],
  templateUrl: './materials-details.component.html',
  styleUrl: './materials-details.component.css'
})
export class MaterialsDetailsComponent implements OnInit {

  material: Material | undefined;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadMaterial();
    });
  }

  private loadMaterial(): void {
    // First check static materials
    const staticMaterial = this.staticMaterials.find(m => m.id === this.id);
    if (staticMaterial) {
      this.material = staticMaterial;
      return;
    }

    // If not found in static materials, check user-added materials
    const userMaterials = this.getUserMaterials();
    const userMaterial = userMaterials.find(m => m.id === this.id);
    if (userMaterial) {
      this.material = userMaterial;
      return;
    }

    // Material not found
    this.material = undefined;
  }

  private getUserMaterials(): Material[] {
    const storedMaterials = localStorage.getItem('userMaterials');
    return storedMaterials ? JSON.parse(storedMaterials) : [];
  }

  goBack() {
    this.router.navigate(['/materials']);
  }

  // Static materials data
  staticMaterials: Material[] = [
      {
        id: 1,
        name: "Copper",
        category: "Metal",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI0x6tfoluh5Hr34K9mheSAAHqHPcjHxKaIzFI0UxZOXuDoMGhpmMztgP5rPCMjDtRJ24&usqp=CAU",
        desc: "A reddish-brown metal with excellent electrical conductivity, used in wiring and electronics."
      },
      {
        id: 2,
        name: "Aluminum",
        category: "Metal",
        image: "https://www.scrapware.com/wp-content/uploads/2020/08/recycled-cans-1-1024x710.jpg",
        desc: "A lightweight, corrosion-resistant metal used in cans, aircraft, and construction."
      },
      {
        id: 3,
        name: "Stainless Steel",
        category: "Metal",
        image: "https://www.anis-trend.com/wp-content/uploads/2021/11/metal.jpg",
        desc: "A durable, rust-resistant alloy used in appliances, cutlery, and medical tools."
      },
      {
        id: 4,
        name: "Pine Wood",
        category: "Wood",
        image: "https://www.forestinnovationhubs.rosewood-network.eu/sites/default/files/bp/multimedia/main_pics/rilegno_product_pics_2.jpg",
        desc: "A soft, affordable wood commonly used in furniture and framing."
      },
      {
        id: 5,
        name: "Oak Wood",
        category: "Wood",
        image: "https://cdn.ca.emap.com/wp-content/uploads/sites/6/2021/05/wood.jpg",
        desc: "A strong, hardwood known for its durability in flooring and cabinetry."
      },
      {
        id: 6,
        name: "Bamboo",
        category: "Wood",
        image: "https://magazin.tu-braunschweig.de/wp-content/uploads/2024/02/joshua-hoehne-XG9mXns-340-unsplash1-1200x800.jpg",
        desc: "A fast-growing, sustainable material used in flooring and eco-friendly products."
      },
      {
        id: 7,
        name: "Cotton",
        category: "Fabric",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQomN6jzDq0wJORXxU2LuiK0BcGnoPuOk9oaByRU3XgLnpNzd8MFirDJ8T38mX51YFtJTs&usqp=CAU",
        desc: "A natural, breathable fiber used in clothing, towels, and bedding."
      },
      {
        id: 8,
        name: "Silk",
        category: "Fabric",
        image: "https://ecostore.com/media/magefan_blog/Recycled_Fabrics_1200.jpg",
        desc: "A luxurious, smooth fabric produced by silkworms, used in high-end garments."
      },
      {
        id: 9,
        name: "Polyester",
        category: "Fabric",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLqWmHEWShidjgPd8l3qObtyTnIjW3v654Zpsm8WDqNFyRK3gH0Fyqv6bohZbSp2PzKF4&usqp=CAU",
        desc: "A synthetic, wrinkle-resistant fabric often blended with cotton."
      },
      {
        id: 10,
        name: "Polycarbonate",
        category: "Plastic",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa54WWMgvfkrawzzRgQc6UZac9B6ZbblQ2NUtgVgr_l3jXygKLXzVytuBz5Yd7s-zR3KE&usqp=CAU",
        desc: "A tough, transparent thermoplastic used in eyewear and bulletproof glass."
      },
      {
        id: 11,
        name: "PVC",
        category: "Plastic",
        image: "https://live.staticflickr.com/65535/51899745895_fd7270c927_b.jpg",
        desc: "A versatile plastic used in pipes, cables, and vinyl flooring."
      },
      {
        id: 12,
        name: "Acrylic",
        category: "Plastic",
        image: "https://www.lakelandgov.net/media/10465/plastic.png?width=1437&height=1231",
        desc: "A lightweight, shatter-resistant alternative to glass."
      },
      {
        id: 13,
        name: "Granite",
        category: "Stone",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GOfbYKP39RlXf-qxjIeuJ5utWf75wJSIOBq4EgC0rJ4PUl6Bc_jFVj5JaHrKSXM3jHY&usqp=CAU",
        desc: "A hard, igneous rock used in countertops and monuments."
      },
      {
        id: 14,
        name: "Marble",
        category: "Stone",
        image: "https://www.stone-ideas.com/wordpress/wp-content/uploads/2015/06/Recycled-Stones15-1-2.jpg",
        desc: "An elegant, veined stone used in sculpture and high-end architecture."
      },
      {
        id: 15,
        name: "Sandstone",
        category: "Stone",
        image: "https://www.recyclingbristol.com/wp-content/uploads/Sorted-Bricks.jpg",
        desc: "A sedimentary rock often used in building facades and paving."
      },
      {
        id: 16,
        name: "Rubber",
        category: "Elastomer",
        image: "https://www.industrialrubbergoods.com/images/recycled-rubber-uses-1.jpg",
        desc: "A flexible material used in tires, seals, and footwear."
      },
      {
        id: 17,
        name: "Glass",
        category: "Ceramic",
        image: "https://res.cloudinary.com/ethicalshift/image/upload/v1673997147/recycling_ceramic_b378841e0a.png",
        desc: "A transparent, brittle material made from silica, used in windows and bottles."
      },
      {
        id: 18,
        name: "Porcelain",
        category: "Ceramic",
        image: "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fdf4a8f09-23fd-40b3-8f27-51eeb5681f8d.jpg?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1",
        desc: "A refined ceramic used in dishware, tiles, and dental implants."
      },
      {
        id: 19,
        name: "Carbon Fiber",
        category: "Composite",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTItYSgAavPUva4dqu-RMUp45t3WJq9-7j9Ee6evtS2CUMG8mw1piqQSv4kqhMwEBdK0g&usqp=CAU",
        desc: "An ultra-strong, lightweight material used in aerospace and sports equipment."
      },
      {
        id: 20,
        name: "Concrete",
        category: "Construction",
        image: "https://www.zters.com/blog/wp-content/uploads/2021/08/recycle-construction-materials.png",
        desc: "A mixture of cement, sand, and aggregate used in buildings and roads."
      }
    ];

  


  // materialsList = [
  //   {
  //     id: 1,
  //     name: "Copper",
  //     category: "Metal",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI0x6tfoluh5Hr34K9mheSAAHqHPcjHxKaIzFI0UxZOXuDoMGhpmMztgP5rPCMjDtRJ24&usqp=CAU",
  //     desc: "A reddish-brown metal with excellent electrical conductivity, used in wiring and electronics."
  //   },
  //   {
  //     id: 2,
  //     name: "Aluminum",
  //     category: "Metal",
  //     image: "https://www.scrapware.com/wp-content/uploads/2020/08/recycled-cans-1-1024x710.jpg",
  //     desc: "A lightweight, corrosion-resistant metal used in cans, aircraft, and construction."
  //   },
  //   {
  //     id: 3,
  //     name: "Stainless Steel",
  //     category: "Metal",
  //     image: "https://www.anis-trend.com/wp-content/uploads/2021/11/metal.jpg",
  //     desc: "A durable, rust-resistant alloy used in appliances, cutlery, and medical tools."
  //   },
  //   {
  //     id: 4,
  //     name: "Pine Wood",
  //     category: "Wood",
  //     image: "https://www.forestinnovationhubs.rosewood-network.eu/sites/default/files/bp/multimedia/main_pics/rilegno_product_pics_2.jpg",
  //     desc: "A soft, affordable wood commonly used in furniture and framing."
  //   },
  //   {
  //     id: 5,
  //     name: "Oak Wood",
  //     category: "Wood",
  //     image: "https://cdn.ca.emap.com/wp-content/uploads/sites/6/2021/05/wood.jpg",
  //     desc: "A strong, hardwood known for its durability in flooring and cabinetry."
  //   },
  //   {
  //     id: 6,
  //     name: "Bamboo",
  //     category: "Wood",
  //     image: "https://magazin.tu-braunschweig.de/wp-content/uploads/2024/02/joshua-hoehne-XG9mXns-340-unsplash1-1200x800.jpg",
  //     desc: "A fast-growing, sustainable material used in flooring and eco-friendly products."
  //   },
  //   {
  //     id: 7,
  //     name: "Cotton",
  //     category: "Fabric",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQomN6jzDq0wJORXxU2LuiK0BcGnoPuOk9oaByRU3XgLnpNzd8MFirDJ8T38mX51YFtJTs&usqp=CAU",
  //     desc: "A natural, breathable fiber used in clothing, towels, and bedding."
  //   },
  //   {
  //     id: 8,
  //     name: "Silk",
  //     category: "Fabric",
  //     image: "https://ecostore.com/media/magefan_blog/Recycled_Fabrics_1200.jpg",
  //     desc: "A luxurious, smooth fabric produced by silkworms, used in high-end garments."
  //   },
  //   {
  //     id: 9,
  //     name: "Polyester",
  //     category: "Fabric",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLqWmHEWShidjgPd8l3qObtyTnIjW3v654Zpsm8WDqNFyRK3gH0Fyqv6bohZbSp2PzKF4&usqp=CAU",
  //     desc: "A synthetic, wrinkle-resistant fabric often blended with cotton."
  //   },
  //   {
  //     id: 10,
  //     name: "Polycarbonate",
  //     category: "Plastic",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa54WWMgvfkrawzzRgQc6UZac9B6ZbblQ2NUtgVgr_l3jXygKLXzVytuBz5Yd7s-zR3KE&usqp=CAU",
  //     desc: "A tough, transparent thermoplastic used in eyewear and bulletproof glass."
  //   },
  //   {
  //     id: 11,
  //     name: "PVC",
  //     category: "Plastic",
  //     image: "https://live.staticflickr.com/65535/51899745895_fd7270c927_b.jpg",
  //     desc: "A versatile plastic used in pipes, cables, and vinyl flooring."
  //   },
  //   {
  //     id: 12,
  //     name: "Acrylic",
  //     category: "Plastic",
  //     image: "https://www.lakelandgov.net/media/10465/plastic.png?width=1437&height=1231",
  //     desc: "A lightweight, shatter-resistant alternative to glass."
  //   },
  //   {
  //     id: 13,
  //     name: "Granite",
  //     category: "Stone",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GOfbYKP39RlXf-qxjIeuJ5utWf75wJSIOBq4EgC0rJ4PUl6Bc_jFVj5JaHrKSXM3jHY&usqp=CAU",
  //     desc: "A hard, igneous rock used in countertops and monuments."
  //   },
  //   {
  //     id: 14,
  //     name: "Marble",
  //     category: "Stone",
  //     image: "https://www.stone-ideas.com/wordpress/wp-content/uploads/2015/06/Recycled-Stones15-1-2.jpg",
  //     desc: "An elegant, veined stone used in sculpture and high-end architecture."
  //   },
  //   {
  //     id: 15,
  //     name: "Sandstone",
  //     category: "Stone",
  //     image: "https://www.recyclingbristol.com/wp-content/uploads/Sorted-Bricks.jpg",
  //     desc: "A sedimentary rock often used in building facades and paving."
  //   },
  //   {
  //     id: 16,
  //     name: "Rubber",
  //     category: "Elastomer",
  //     image: "https://www.industrialrubbergoods.com/images/recycled-rubber-uses-1.jpg",
  //     desc: "A flexible material used in tires, seals, and footwear."
  //   },
  //   {
  //     id: 17,
  //     name: "Glass",
  //     category: "Ceramic",
  //     image: "https://res.cloudinary.com/ethicalshift/image/upload/v1673997147/recycling_ceramic_b378841e0a.png",
  //     desc: "A transparent, brittle material made from silica, used in windows and bottles."
  //   },
  //   {
  //     id: 18,
  //     name: "Porcelain",
  //     category: "Ceramic",
  //     image: "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fdf4a8f09-23fd-40b3-8f27-51eeb5681f8d.jpg?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1",
  //     desc: "A refined ceramic used in dishware, tiles, and dental implants."
  //   },
  //   {
  //     id: 19,
  //     name: "Carbon Fiber",
  //     category: "Composite",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTItYSgAavPUva4dqu-RMUp45t3WJq9-7j9Ee6evtS2CUMG8mw1piqQSv4kqhMwEBdK0g&usqp=CAU",
  //     desc: "An ultra-strong, lightweight material used in aerospace and sports equipment."
  //   },
  //   {
  //     id: 20,
  //     name: "Concrete",
  //     category: "Construction",
  //     image: "https://www.zters.com/blog/wp-content/uploads/2021/08/recycle-construction-materials.png",
  //     desc: "A mixture of cement, sand, and aggregate used in buildings and roads."
  //   }
  // ];


}
