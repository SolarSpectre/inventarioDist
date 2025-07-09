import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center text-center">
      <div className="space-y-6">
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
          Sistema de Gestión de Inventario
        </h1>
        <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Registra productos, valida códigos únicos y consulta disponibilidad 
          en tiempo real de manera simple y eficiente.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="text-lg px-8 py-3">
          <Link href="/protected">Comenzar Ahora</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3">
          <Link href="#features">Ver Características</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Registro de Productos</h3>
          <p className="text-muted-foreground">
            Registra nuevos productos con nombre, código, descripción, unidad y categoría de manera sencilla.
          </p>
        </div>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Validación de Códigos</h3>
          <p className="text-muted-foreground">
            Sistema automático que valida y previene códigos de productos duplicados en tu inventario.
          </p>
        </div>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Consulta en Tiempo Real</h3>
          <p className="text-muted-foreground">
            Consulta la disponibilidad de productos instantáneamente con información actualizada al momento.
          </p>
        </div>
      </div>
    </div>
  );
}
