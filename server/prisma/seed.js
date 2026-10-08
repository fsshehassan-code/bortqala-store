import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();
const products=[
 ['آيفون 15','iphone-15',38250,45000,10,'📱'],['حذاء رياضي','sports-shoes',1170,1800,25,'👟'],['ساعة ذكية','smart-watch',1999,2500,18,'⌚'],['مقلاة هوائية','air-fryer',2625,3500,12,'🍳'],['سماعات بلوتوث لاسلكية','wireless-headphones',1399,2000,30,'🎧']
];
async function main(){
 const adminHash=await bcrypt.hash('Admin@12345',12);
 await prisma.user.upsert({where:{email:'admin@orange.local'},update:{},create:{email:'admin@orange.local',name:'مدير المتجر',passwordHash:adminHash,role:'ADMIN'}});
 const cat=await prisma.category.upsert({where:{slug:'featured'},update:{},create:{name:'عروض مميزة',slug:'featured'}});
 for(const [name,slug,price,compareAt,stock,icon] of products) await prisma.product.upsert({where:{slug},update:{icon},create:{name,slug,price,compareAt,stock,icon,rating:4.8,categoryId:cat.id}});
 console.log('Seed complete. Admin: admin@orange.local / Admin@12345');
}
main().finally(()=>prisma.$disconnect());
