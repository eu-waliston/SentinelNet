<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/98207229-7007-4965-ba05-ffaf0c4e93cf" />

> Plataforma de Threat Intelligence, correlação de infraestrutura e análise de risco para detecção de ameaças cibernéticas.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Node](https://img.shields.io/badge/Node.js-TypeScript-green)
![Python](https://img.shields.io/badge/ML-Python-yellow)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![React](https://img.shields.io/badge/frontend-React-blue)

---

## 🧠 Sobre o projeto

O **SentinelNet** é uma plataforma experimental de **Cyber Threat Intelligence (CTI)** desenvolvida para coletar, correlacionar e analisar informações públicas sobre infraestrutura de rede.

O objetivo é identificar relacionamentos entre diferentes indicadores, como:

- 🌐 Domínios
- 🌍 Endereços IP
- 🏢 ASN
- 🔐 Certificados TLS
- 🔎 Registros DNS
- 📡 Histórico de resolução
- 🌎 Informações WHOIS/RDAP
- 🌐 Metadados HTTP
- 🕸️ Relações entre infraestruturas

A partir desses dados, o SentinelNet busca construir uma visão contextual da infraestrutura analisada e calcular um **Risk Score**, permitindo priorizar investigações e auxiliar mecanismos defensivos.

> **O SentinelNet não tem como objetivo substituir uma análise humana.**
>
> O sistema fornece evidências, correlações e indicadores para auxiliar processos de investigação e defesa.

---

# 🎯 Objetivo

O problema que o SentinelNet tenta resolver é relativamente simples:

> **Como identificar que diferentes indicadores aparentemente independentes fazem parte da mesma infraestrutura ou apresentam comportamento semelhante?**

Uma análise tradicional poderia observar apenas:

```text
example.com
      ↓
185.x.x.x
```

O SentinelNet busca enxergar:

```text
                         ┌── Certificate A
                         │
example.com ───→ IP ─────┼── ASN 12345
                         │
                         └── Domain B
                              │
                              └── IP 185.x.x.x
```

Quanto mais evidências independentes apontarem para uma mesma infraestrutura, maior pode ser a prioridade de investigação.

---

# 🏗️ Arquitetura

A V1 do SentinelNet segue uma arquitetura baseada em coleta, normalização, extração de características, correlação e análise de risco.

```text
                    ┌─────────────────────┐
                    │   Fontes de dados   │
                    │ DNS / HTTP / TLS    │
                    │ WHOIS / ASN / IP    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Data Collector    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Feature Extraction  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐  ┌──────────────┐
       │ ML         │   │ Graph       │  │ Anomaly      │
       │ Classifier │   │ Correlation │  │ Detection    │
       └─────┬──────┘   └──────┬──────┘  └──────┬───────┘
             │                 │                │
             └─────────────────┼────────────────┘
                               │
                               ▼
                       ┌────────────────┐
                       │  Risk Engine   │
                       └───────┬────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │ Decision / Review │
                     └───────────────────┘
```

---

# 🧱 Stack tecnológica

## Backend

- Node.js
- TypeScript
- Fastify ou Express
- MongoDB
- Redis
- REST API

O backend será responsável por:

- gerenciamento das entidades;
- ingestão de eventos;
- armazenamento;
- API;
- correlação;
- execução do Risk Engine;
- comunicação com o serviço de Machine Learning.

---

## 🐍 Machine Learning

O processamento de Machine Learning será mantido em um serviço separado.

Tecnologias planejadas:

- Python
- scikit-learn
- XGBoost
- NetworkX
- PyTorch

A separação entre backend e ML permite evoluir os modelos sem transformar o backend Node.js em um Frankenstein tecnológico.

---

# 🕸️ Threat Intelligence

O SentinelNet poderá trabalhar com diferentes fontes de inteligência.

## DNS

- registros A/AAAA;
- CNAME;
- MX;
- NS;
- histórico de resolução;
- alterações de infraestrutura.

## IP / ASN

- endereço IP;
- ASN;
- organização;
- relacionamento entre infraestrutura;
- concentração de domínios.

## TLS

- certificados;
- fingerprints;
- emissor;
- validade;
- Subject;
- SANs;
- compartilhamento de certificados.

## WHOIS / RDAP

- informações de registro;
- datas;
- registrador;
- entidades associadas quando disponíveis.

## HTTP

- headers;
- redirects;
- status codes;
- tecnologias identificáveis;
- metadata.

---

# 🧠 Modelo de dados

O primeiro objetivo do projeto não é criar uma IA.

É criar uma **representação confiável da infraestrutura**.

Um dos modelos centrais será baseado em nós e relacionamentos.

```typescript
interface InfrastructureNode {
  type: "DOMAIN" | "IP" | "ASN" | "CERTIFICATE";
  value: string;

  firstSeen: Date;
  lastSeen: Date;

  riskScore: number;

  tags: string[];

  relationships: Relationship[];
}
```

Os relacionamentos representam conexões observadas entre diferentes entidades.

```typescript
interface Relationship {
  source: string;
  target: string;

  type:
    | "RESOLVES_TO"
    | "USES_CERTIFICATE"
    | "BELONGS_TO_ASN"
    | "SHARES_INFRASTRUCTURE"
    | "REDIRECTS_TO";

  confidence: number;
}
```

---

# 🕸️ Exemplo de correlação

Uma infraestrutura pode ser representada dessa forma:

```text
                    example.bet
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
             IP       Cert X     ASN 123
              │          │          │
              │          │          └──────→ Domain C
              │          │
              │          └─────────────────→ Domain B
              │
              └────────────────────────────→ Domain D
```

Cada relacionamento possui uma **confidence**, permitindo representar o grau de confiança da associação.

Exemplo:

```json
{
  "source": "example.bet",
  "target": "185.x.x.x",
  "type": "RESOLVES_TO",
  "confidence": 0.98
}
```

---

# 🔥 Risk Engine

O Risk Engine será responsável por transformar evidências em indicadores de risco.

Uma primeira implementação pode utilizar regras:

```text
DNS similarity        +15
Infrastructure link  +20
Certificate link     +15
ASN correlation      +10
Behavior anomaly     +20
Known bad relation   +20
                       ───
                       100
```

Entretanto, o objetivo não é permanecer em um sistema baseado apenas em regras.

A evolução planejada é:

```text
V1 → Rule-based scoring
V2 → Random Forest / XGBoost
V3 → Anomaly Detection
V4 → Graph-based ML
V5 → Ensemble / Hybrid Model
```

---

# 📊 Composição do Risk Score

O sistema poderá manter diferentes dimensões de análise:

```text
RULE SCORE
     │
     ├──────────────┐
     │              │
ML SCORE       GRAPH SCORE
     │              │
     └──────┬───────┘
            │
      ANOMALY SCORE
            │
            ▼
    ┌────────────────┐
    │ FINAL RISK     │
    │ SCORE          │
    └────────────────┘
```

Além do score final, o sistema deverá armazenar as evidências que contribuíram para sua composição.

Isso permite responder:

> **"Por que esse indicador recebeu esse score?"**

em vez de simplesmente dizer:

```text
riskScore = 94
```

Um número isolado não explica nada.

---

# 🖥️ Dashboard

O frontend será desenvolvido utilizando:

- React
- TypeScript
- Vite

O dashboard deverá fornecer uma visão operacional da infraestrutura analisada.

Exemplo conceitual:

```text
┌─────────────────────────────────────────────┐
│ SentinelNet                                 │
├─────────────────────────────────────────────┤
│                                             │
│  RISK       DOMAIN          STATUS          │
│  96         example.bet     BLOCK           │
│  91         another.bet     REVIEW          │
│  87         site.xyz        REVIEW          │
│  23         example.com     CLEAN            │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 🔎 Investigação de um indicador

Ao selecionar um domínio, o sistema deverá apresentar suas relações:

```text
                    example.bet
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           IP 1       Cert X      ASN 123
              │                     │
              ▼                     ▼
          Domain B              Domain C
              │
              ▼
          Domain D
```

Também deverão ser apresentadas as evidências responsáveis pela classificação.

Exemplo:

```text
Risk Score: 94

Evidence

✓ 6 relacionamentos com infraestrutura
  previamente classificada.

✓ 3 domínios compartilham certificado.

✓ 4 domínios compartilham infraestrutura.

✓ Alterações de DNS detectadas nas
  últimas 72 horas.

Confidence: 91%
```

---

# 📦 Roadmap

## Módulo 1 — Core

- [ ] Arquitetura inicial
- [ ] TypeScript
- [ ] API
- [ ] MongoDB
- [ ] Modelos de dados
- [ ] Entidades
- [ ] Eventos
- [ ] Health Check
- [ ] Configuração de ambiente

---

## Módulo 2 — Threat Intelligence

- [ ] DNS collector
- [ ] IP intelligence
- [ ] ASN intelligence
- [ ] TLS certificates
- [ ] WHOIS/RDAP
- [ ] HTTP metadata
- [ ] Normalização dos indicadores
- [ ] Armazenamento dos dados coletados

---

## Módulo 3 — Correlation Engine

- [ ] Modelo de relacionamentos
- [ ] Construção do grafo
- [ ] Correlação de infraestrutura
- [ ] Descoberta de infraestrutura compartilhada
- [ ] Confidence score
- [ ] Histórico de relacionamentos

---

## Módulo 4 — Risk Engine

- [ ] Sistema de regras
- [ ] Risk Score
- [ ] Evidências
- [ ] Confidence
- [ ] Priorização
- [ ] Explicabilidade

---

## Módulo 5 — Machine Learning

- [ ] Dataset
- [ ] Feature engineering
- [ ] Feature selection
- [ ] Treinamento
- [ ] Validação
- [ ] Classificação
- [ ] API de inferência
- [ ] XGBoost / Random Forest

---

## Módulo 6 — Anomaly Detection

- [ ] Baseline de comportamento
- [ ] Detecção de alterações DNS
- [ ] Mudanças de infraestrutura
- [ ] Novos relacionamentos
- [ ] Anomalias temporais
- [ ] Alertas

---

## Módulo 7 — Dashboard

- [ ] Dashboard operacional
- [ ] Lista de indicadores
- [ ] Risk Score
- [ ] Grafo de infraestrutura
- [ ] Timeline
- [ ] Página de investigação
- [ ] Visualização de evidências

---

## Módulo 8 — Blocking Integration

- [ ] Geração de listas
- [ ] Exportação de indicadores
- [ ] DNS filtering
- [ ] Proxy integration
- [ ] Firewall integration
- [ ] API de integração

> O sistema deverá produzir indicadores e mecanismos de integração defensiva para ambientes sob controle ou autorização do operador.

---

## Módulo 9 — IA Avançada

- [ ] Correlação automática
- [ ] Classificação contextual
- [ ] Explicação dos resultados
- [ ] Priorização de investigação
- [ ] Graph-based ML
- [ ] Modelos híbridos
- [ ] Assistência à análise

---

# 🔐 Segurança e uso responsável

O SentinelNet será desenvolvido exclusivamente para fins de:

- defesa cibernética;
- análise de infraestrutura;
- Threat Intelligence;
- pesquisa;
- detecção de anomalias;
- monitoramento autorizado;
- integração com mecanismos defensivos.

As fontes de dados devem ser públicas, autorizadas ou obtidas dentro de ambientes controlados.

O projeto **não tem como objetivo**:

- explorar sistemas de terceiros;
- comprometer servidores;
- realizar ataques;
- contornar mecanismos de proteção;
- derrubar infraestrutura;
- automatizar ações ofensivas não autorizadas.

O bloqueio ou mitigação deverá ocorrer apenas em ambientes sob controle ou autorização.

---

# 🧪 Desenvolvimento

O projeto será desenvolvido de forma incremental.

A prioridade será:

```text
FUNCIONAR
   ↓
MEDIR
   ↓
VALIDAR
   ↓
EXPLICAR
   ↓
OTIMIZAR
   ↓
ADICIONAR IA
```

A IA entra depois que existir uma base de dados confiável.

Não faz sentido treinar um modelo sofisticado em cima de dados ruins e depois chamar o resultado de "Inteligência Artificial".

Isso é estatística usando terno.

---

# 🗂️ Estrutura planejada

```text
SentinelNet/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── collectors/
│   │   ├── correlation/
│   │   ├── risk/
│   │   └── app.ts
│   │
│   └── package.json
│
├── ml/
│   ├── src/
│   │   ├── features/
│   │   ├── models/
│   │   ├── training/
│   │   ├── inference/
│   │   └── anomaly/
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   │
│   └── package.json
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── models/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Visão futura

A visão de longo prazo do SentinelNet é transformar diferentes fontes de informação em uma **rede de conhecimento sobre infraestrutura de internet**.

Em vez de analisar indicadores isoladamente:

```text
DOMAIN
IP
ASN
CERTIFICATE
DNS
HTTP
```

o sistema deverá enxergá-los como partes de uma estrutura conectada:

```text
                    ┌──────────┐
                    │ DOMAIN   │
                    └────┬─────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       ┌──────┐      ┌──────┐       ┌──────┐
       │  IP  │      │ CERT │       │ DNS  │
       └──┬───┘      └──┬───┘       └──────┘
          │             │
          ▼             ▼
       ┌──────┐      ┌──────┐
       │ ASN  │      │DOMAIN│
       └──────┘      └──┬───┘
                         │
                         ▼
                     ┌───────┐
                     │  IP   │
                     └───────┘
```

O resultado esperado é uma plataforma capaz de responder não apenas:

> **"Esse domínio é suspeito?"**

mas também:

> **"Quais evidências sustentam essa classificação?"**

> **"Com quais outras infraestruturas ele está relacionado?"**

> **"Quais mudanças ocorreram recentemente?"**

> **"Quais indicadores merecem investigação primeiro?"**

---

# 📌 Princípios do projeto

O desenvolvimento do SentinelNet seguirá alguns princípios.

### 🔍 Evidence First

Toda classificação deve ser acompanhada de evidências.

### 🧠 Explainable Intelligence

O sistema deve explicar como chegou a determinado resultado.

### 🕸️ Relationship Driven

Indicadores isolados contam apenas parte da história.

### 🛡️ Defensive by Design

O projeto é orientado para defesa e análise autorizada.

### 📈 Incremental Development

Cada módulo deve funcionar antes da próxima camada ser adicionada.

### 🤖 AI as a Tool

Machine Learning deve ampliar a capacidade analítica, não substituir a validação dos dados.

---

# 📍 Status

🚧 **Em desenvolvimento**

Versão atual:

```text
v0.1.0
```

Foco atual:

```text
Módulo 1 — Core
```

---

# 👨‍💻 Desenvolvimento

Projeto desenvolvido como iniciativa de pesquisa e desenvolvimento em:

- Cybersecurity
- Cyber Threat Intelligence
- Machine Learning
- Anomaly Detection
- Network Analysis
- Infrastructure Correlation

---

# ⚖️ Licença

A licença do projeto ainda será definida.

---

> **SentinelNet**
>
> *Observe. Correlate. Understand. Defend.*
