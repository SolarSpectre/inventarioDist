import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Sistema de Inventario</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          
          <section id="features" className="flex-1 flex flex-col gap-8 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Características Principales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">📝 Registro de Productos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Nombre del producto</li>
                  <li>• Código único</li>
                  <li>• Descripción detallada</li>
                  <li>• Unidad de medida</li>
                  <li>• Categoría</li>
                </ul>
              </div>
              
              <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">✅ Validación de Códigos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Prevención de códigos duplicados</li>
                  <li>• Validación automática en tiempo real</li>
                  <li>• Alertas de duplicación</li>
                  <li>• Códigos únicos garantizados</li>
                </ul>
              </div>
              
              <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">🔍 Consulta en Tiempo Real</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Disponibilidad instantánea</li>
                  <li>• Información actualizada</li>
                  <li>• Búsqueda rápida</li>
                  <li>• Resultados precisos</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Desarrollado con{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            y{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Next.js
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
