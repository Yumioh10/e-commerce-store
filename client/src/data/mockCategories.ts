import type { Product } from '@/types';

export const categories = [
  { id: 'visage', name: 'Soin Visage', description: 'Des soins adaptés aux besoins de la peau face au climat marocain (soleil, chaleur, pollution), pour une peau hydratée, protégée et éclatante.' },
  { id: 'maquillage', name: 'Maquillage', description: 'Une gamme complète de maquillage pour un look naturel ou sophistiqué, adaptée à toutes les carnations et à un usage quotidien.' },
  { id: 'dermocosmetique', name: 'Dermocosmétique', description: 'Produits recommandés par des professionnels de santé pour traiter les problématiques cutanées courantes.' },
  { id: 'hygiene&soins-quotidiens', name: 'Hygiène & Soins Quotidiens', description: 'Produits essentiels pour une hygiène irréprochable, respectueux de la peau et adaptés à toute la famille.' },
  { id: 'soins-corps', name: 'Soin Corps', description: 'Des soins nourrissants et réparateurs pour protéger la peau contre la sécheresse et les agressions extérieures.' },
  { id: 'soins-capillaires', name: 'Soins Capillaires', description: 'Des soins ciblés pour répondre aux problématiques fréquentes : chute de cheveux, cheveux secs, bouclés ou abîmés.' },
  { id: 'naturel-bio', name: 'Produits Naturel & Bio', description: 'gamme de cosmétiques formulés à partir d’ingrédients naturels, respectueux de la peau et de l’environnement.' },
  { id: 'maman-bebe', name: 'Bébé & Maman', description: 'Des soins doux et sécurisés pour la peau fragile des bébés et les besoins spécifiques des mamans.' },
  { id: 'complement-alimentaire', name: 'Compléments Alimentaires', description: 'Des compléments pour soutenir la beauté, l’immunité et le bien-être au quotidien.' },
  { id: 'accessoires', name: 'Accessoires', description: 'Des accessoires pratiques et indispensables pour compléter votre routine beauté et optimiser l’efficacité de vos soins à domicile' },
  { id: 'soins-hommes', name: 'Soins pour Hommes', description: 'Une gamme complète de soins spécialement formulés pour répondre aux besoins de la peau et des cheveux masculins, exposés au rasage, à la chaleur et aux agressions quotidiennes.' },
  { id: 'hiver-deals', name: 'Hiver Deals', description: 'Nos Coffrets et Promotions pendant l’hiver' },
  
] as const;

export const getProductsByCategory = (categoryId: string, products: Product[]) => {
  return products.filter((p) => p.category === categoryId);
};