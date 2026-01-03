import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, ArrowRight, Lock, FileText, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';

const tests = [
  {
    id: 'tdah-adultos',
    name: 'ASRS - TDAH en Adultos',
    description: 'Escala de autorreporte para síntomas de TDAH en personas adultas.',
    questions: 18,
    time: '5-10 min',
    href: '/tests/tdah-adultos',
  },
  {
    id: 'tea-aq10',
    name: 'AQ-10 - Screening TEA',
    description: 'Cuestionario breve para identificar rasgos del espectro autista.',
    questions: 10,
    time: '3-5 min',
    href: '/tests/tea-aq10',
  },
  {
    id: 'dislexia',
    name: 'Screening de Dislexia',
    description: 'Evaluación inicial de indicadores de dislexia en adultos.',
    questions: 15,
    time: '5-8 min',
    href: '/tests/dislexia',
  },
  {
    id: 'funciones-ejecutivas',
    name: 'Funciones Ejecutivas',
    description: 'Evalúa dificultades en planificación, organización y autorregulación.',
    questions: 20,
    time: '8-12 min',
    href: '/tests/funciones-ejecutivas',
  },
  {
    id: 'discalculia',
    name: 'Screening de Discalculia',
    description: 'Evaluación de indicadores de dificultades en el procesamiento numérico.',
    questions: 15,
    time: '5-8 min',
    href: '/tests/discalculia',
  },
  {
    id: 'dispraxia',
    name: 'Screening de Dispraxia/TDC',
    description: 'Evaluación de dificultades en la coordinación motora y planificación de movimientos.',
    questions: 18,
    time: '7-10 min',
    href: '/tests/dispraxia',
  },
];

export default function Tests() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ClipboardCheck className="w-4 h-4" />
              <span>Autoevaluación</span>
            </div>
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Herramientas de screening para explorar diferentes características neurodivergentes."
            >
              Tests de Autoevaluación
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Aviso */}
          <ContentBlock variant="warning" className="mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
              <div>
                <h2 className="font-medium mb-1">Importante</h2>
                <p className="text-sm text-muted-foreground">
                  Estos tests son herramientas de screening, no diagnósticos. 
                  Una puntuación alta indica que podría ser beneficioso buscar una evaluación profesional.
                  Solo un especialista puede realizar un diagnóstico formal.
                </p>
              </div>
            </div>
          </ContentBlock>

          {/* Cómo funciona */}
          <ContentBlock className="mb-8">
            <h2 className="font-heading font-semibold text-xl mb-4">¿Cómo funciona?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0 text-sm font-medium">
                  ✓
                </div>
                <div>
                  <h3 className="font-medium">Gratuito</h3>
                  <p className="text-sm text-muted-foreground">Puntuación y banda de riesgo sin coste</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium">Premium (1€)</h3>
                  <p className="text-sm text-muted-foreground">Análisis detallado en PDF por IA</p>
                </div>
              </div>
            </div>
          </ContentBlock>

          {/* Tests List */}
          <div className="space-y-4">
            {tests.map((test, index) => (
              <Link
                key={test.id}
                to={test.href}
                className="group block p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-fade-in focus-ring"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg mb-1">{test.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{test.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{test.questions} preguntas</span>
                      <span>·</span>
                      <span>{test.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Realizar Test
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
