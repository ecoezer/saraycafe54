import {
    salads,
    dips,
    alkoholfreieGetraenke,
    alkoholischeGetraenke,
    fleischgerichte,
    grillspezialitaeten,
    pizzas,
    croques,
    pide,
    schnitzel,
    auflauf,
    lahmacun,
    baguette,
    calzone,
    pasta,
    nachtisch,
} from '../data/menuItems';
import { MenuItem } from '../types';

export interface MenuSectionConfig {
    id: string;
    title: string;
    description: string;
    items: readonly MenuItem[];
}

export const MENU_SECTIONS: MenuSectionConfig[] = [
    { id: 'fleischgerichte', title: 'Drehspieß', description: 'Döner, Dürüm und mehr', items: fleischgerichte },
    { id: 'grillspezialitaeten', title: 'Grillspezialitäten', description: 'Köfte, Hähnchen und weitere Grillspezialitäten', items: grillspezialitaeten },
    { id: 'lahmacun', title: 'Lahmacun', description: 'Türkische Pizza mit Salat, Tomaten & Sauce', items: lahmacun },
    { id: 'baguette', title: 'Baguette', description: 'Alle Baguettes werden mit Käse, Salat und Remoulade zubereitet.', items: baguette },
    { id: 'auflauf', title: 'Auflauf', description: 'Überbackene Aufläufe mit Käse, Salat und Brot', items: auflauf },
    { id: 'pasta', title: 'Pasta', description: 'Leckere Pasta-Gerichte', items: pasta },
    { id: 'pizza', title: 'Pizza', description: 'Alle Pizzen werden mit Tomatensauce und Käse zubereitet', items: pizzas },
    { id: 'calzone', title: 'Calzone', description: 'Gefüllte Teigtaschen - Extras: Hollandaise, Dönerfleisch, Meeresfrüchte, Hähnchenbrustfilet verfügbar', items: calzone },
    { id: 'pide', title: 'Pide', description: 'Alle Pides werden mit Gouda-Käse zubereitet', items: pide },
    { id: 'croques', title: 'Falafel, Burger & co', description: '', items: croques },
    { id: 'schnitzel', title: 'Schnitzel', description: 'Alle Schnitzel werden mit Geflügelfleisch, gemischtem Salat, Krautsalat & Pommes serviert', items: schnitzel },
    { id: 'salate', title: 'Salate', description: 'Alle Salate werden mit Joghurt-Dressing & Brot serviert', items: salads },
    { id: 'dips', title: 'Dips & Soßen', description: 'Leckere Dips und Soßen', items: dips },
    { id: 'nachtisch', title: 'Nachtisch', description: 'Süße Desserts und leckere Nachspeisen', items: nachtisch },
    { id: 'alkoholfreie-getraenke', title: 'Alkoholfreie Getränke', description: 'Erfrischende alkoholfreie Getränke', items: alkoholfreieGetraenke },
    { id: 'alkoholische-getraenke', title: 'Alkoholische Getränke', description: 'Alkoholische Getränke dürfen gemäß § 9 Jugendschutzgesetz (JuSchG) nur an Personen ab 18 Jahren abgegeben werden. Ein gültiger Ausweis ist vorzulegen.', items: alkoholischeGetraenke }
];

export const CATEGORY_ORDER: string[] = MENU_SECTIONS.map(section => section.id);

export const NAVIGATION_CONFIG = MENU_SECTIONS.map(section => ({
    id: section.id,
    label: section.title
}));
