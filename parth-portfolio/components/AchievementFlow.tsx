"use client";

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import styles from "./AchievementFlow.module.css";

type AchievementItem = {
  title: string;
  body: string;
  meta: string;
};

type AchievementGroup = {
  id: string;
  index: string;
  title: string;
  summary: string;
  signal: string;
  items: AchievementItem[];
};

type DossierNodeData = AchievementGroup & {
  footer: string;
  isExpanded: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
  shouldReduceMotion: boolean;
};

type DossierNode = Node<DossierNodeData, "dossier">;

type FlowSize = {
  width: number;
  height: number;
};

const achievementGroups: AchievementGroup[] = [
  {
    id: "athletics",
    index: "01",
    title: "Athletics",
    summary:
      "Competitive triathlon, national-level racing, resilience, and medals.",
    signal: "International racing / silver medal",
    items: [
      {
        title: "World Triathlon Asia Triathlon Cup 2024, Pokhara",
        body:
          "Raced internationally in Nepal at 16 against athletes above 25, with the 2nd fastest swim in the Indian contingent on a bike bought two days before the race.",
        meta: "International triathlon",
      },
      {
        title: "IRONMAN 5150 Triathlon Chennai 2026",
        body:
          "Finished 23rd in the 18-24 age category despite the run-bike-run format removing swimming, the strongest leg.",
        meta: "23rd in age category",
      },
      {
        title: "37th National Games, Goa",
        body:
          "Started at the National Games, but a jellyfish sting prevented completion.",
        meta: "National racing",
      },
      {
        title: "Telangana CM Cup",
        body: "Silver medalist in the state-level competition.",
        meta: "Silver medalist",
      },
    ],
  },
  {
    id: "technology",
    index: "02",
    title: "Technology & Research",
    summary:
      "Research software, client systems, and specialized tools for real workflows.",
    signal: "Research dev / custom systems",
    items: [
      {
        title: "BITS Pilani Research Software Development",
        body:
          "Software development and research intern for a postdoctoral researcher, building a custom application for a device designed to improve portability and reduce cost.",
        meta: "Research internship",
      },
      {
        title: "Custom Client Software Services",
        body:
          "Building a rent management system for a property owner managing 27 properties across multiple locations.",
        meta: "27-property system",
      },
    ],
  },
  {
    id: "business",
    index: "03",
    title: "Entrepreneurship & Business",
    summary:
      "Entrepreneurship, business analytics, agentic AI, and applied product thinking.",
    signal: "Full ride / analytics + AI",
    items: [
      {
        title: "Yale Entrepreneurial Society High School Fellowship",
        body: "Completed the fellowship with a full-ride scholarship.",
        meta: "Full-ride scholar",
      },
      {
        title: "BITSoM Certificate Program",
        body:
          "Completed a certificate program focused on Business Analytics and Agentic AI.",
        meta: "Analytics + AI",
      },
    ],
  },
  {
    id: "leadership",
    index: "04",
    title: "Leadership & Recognition",
    summary:
      "Initiative, outreach, and measurable recognition beyond standard academics.",
    signal: "Top fundraiser / global percentile",
    items: [
      {
        title: "Habitat for Humanity Fundraiser",
        body:
          "Raised INR 31,000 independently through door-to-door outreach, the highest total in the program. Second place raised INR 17,000.",
        meta: "Top fundraiser",
      },
      {
        title: "Callido College Readiness Skills Program",
        body:
          "Placed in the top 25 percentile worldwide, with Brown University faculty sign-off from Dr. Lina Fruzzetti.",
        meta: "Top 25 percentile",
      },
    ],
  },
];

const ambientPaths = [
  "M -60 138 C 116 82 260 104 414 128 C 574 154 698 94 850 126 C 966 150 1024 112 1092 72",
  "M -42 222 C 134 162 252 192 414 220 C 600 252 720 170 892 204 C 992 224 1030 198 1082 168",
  "M -38 352 C 122 292 260 350 420 326 C 568 304 652 392 804 358 C 944 326 1000 350 1084 294",
  "M -48 508 C 118 432 236 508 386 464 C 540 420 622 532 786 472 C 914 426 998 452 1080 392",
  "M 600 32 C 756 82 780 178 724 252 C 660 336 728 424 844 402 C 958 380 970 510 858 586",
];

const headingWords = ["Selected", "proofs,", "not", "scattered", "claims"];

const cardFooters: Record<string, string> = {
  athletics: "Race. Train. Repeat.",
  technology: "Build. Automate. Scale.",
  business: "Ideate. Validate. Deliver.",
  leadership: "Lead. Impact. Inspire.",
};

const cardRevealDelays: Record<string, number> = {
  athletics: 0.08,
  technology: 0.16,
  business: 0.24,
  leadership: 0.32,
};

const flowZoom = 0.8;

const fallbackFlowPositions: Record<string, { x: number; y: number }> = {
  athletics: { x: 134, y: 540 },
  technology: { x: 470, y: 382 },
  business: { x: 800, y: 258 },
  leadership: { x: 1080, y: 100 },
};

function getFlowPositions(size: FlowSize): Record<string, { x: number; y: number }> {
  if (!size.width || !size.height) {
    return fallbackFlowPositions;
  }

  const cardWidth = 280;
  const cardHeight = 268;
  const gutter = 36;
  const maxX = Math.max(gutter, size.width - cardWidth - gutter);
  const maxY = Math.max(72, size.height - cardHeight - 76);
  const toFlowPoint = (x: number, y: number) => ({
    x: Math.min(maxX, Math.max(gutter, x)) / flowZoom,
    y: Math.min(maxY, Math.max(72, y)) / flowZoom,
  });

  return {
    athletics: toFlowPoint(size.width * 0.08, size.height * 0.59),
    technology: toFlowPoint(size.width * 0.3, size.height * 0.43),
    business: toFlowPoint(size.width * 0.52, size.height * 0.3),
    leadership: toFlowPoint(size.width * 0.74, size.height * 0.1),
  };
}

const nodeTypes = {
  dossier: DossierCard,
};

function DossierCard({ data }: NodeProps<DossierNode>) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const openCard = () => data.onToggle(data.id);
    const openCardFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        data.onToggle(data.id);
      }
    };

    card.addEventListener("click", openCard);
    card.addEventListener("keydown", openCardFromKeyboard);

    return () => {
      card.removeEventListener("click", openCard);
      card.removeEventListener("keydown", openCardFromKeyboard);
    };
  }, [data]);

  return (
    <div
      aria-expanded={data.isExpanded}
      className={`${styles.dossierCard} ${
        data.isHovered ? styles.dossierCardActive : ""
      } ${data.isExpanded ? styles.dossierCardSelected : ""}`}
      onMouseEnter={() => data.onHover(data.id)}
      onMouseLeave={() => data.onHover(null)}
      ref={cardRef}
      role="button"
      tabIndex={0}
    >
      <DossierCardChrome data={data} showHandles />
    </div>
  );
}

function DossierButton({ data }: { data: DossierNodeData }) {
  const updateSpotlight = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spotlight-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spotlight-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      aria-expanded={data.isExpanded}
      className={`nodrag nopan ${styles.dossierCard} ${
        data.isHovered ? styles.dossierCardActive : ""
      } ${data.isExpanded ? styles.dossierCardSelected : ""}`}
      initial={{ opacity: 0, y: 12 }}
      onBlur={() => data.onHover(null)}
      onClick={() => data.onToggle(data.id)}
      onFocus={() => data.onHover(data.id)}
      onHoverEnd={() => data.onHover(null)}
      onHoverStart={() => data.onHover(data.id)}
      onPointerMove={updateSpotlight}
      transition={{
        delay: data.shouldReduceMotion ? 0 : cardRevealDelays[data.id],
        duration: 0.34,
        ease: "easeOut",
      }}
      type="button"
      whileHover={
        data.shouldReduceMotion
          ? undefined
          : {
              scale: 1.015,
              y: -2,
              transition: { duration: 0.22, ease: "easeOut" },
            }
      }
      whileTap={data.shouldReduceMotion ? undefined : { scale: 0.99 }}
    >
      <DossierCardChrome data={data} />
    </motion.button>
  );
}

function DossierCardChrome({
  data,
  showHandles = false,
}: {
  data: DossierNodeData;
  showHandles?: boolean;
}) {
  return (
    <>
      {showHandles ? (
        <>
          <Handle
            className={styles.flowHandle}
            position={Position.Left}
            type="target"
          />
          <Handle
            className={styles.flowHandle}
            position={Position.Right}
            type="source"
          />
        </>
      ) : null}
      <span className={styles.cardCorner} aria-hidden="true" />
      <span className={styles.cardIndex}>{data.index}</span>
      <span className={styles.cardSignal}>{data.signal}</span>
      <span className={styles.cardBody}>
        <strong>{data.title}</strong>
        <span className={styles.cardRule} aria-hidden="true" />
        <small>{data.summary}</small>
      </span>
      <span className={styles.cardFooter}>/ {data.footer}</span>
    </>
  );
}

function DetailModal({
  group,
  onClose,
  shouldReduceMotion,
}: {
  group: AchievementGroup;
  onClose: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label={`${group.title} details`}
      aria-modal="true"
      className={styles.modalLayer}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={onClose}
      role="dialog"
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.article
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={styles.modalPanel}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        onMouseDown={(event) => event.stopPropagation()}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.36,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className={styles.modalCorner} aria-hidden="true" />
        <button
          aria-label={`Close ${group.title} details`}
          className={styles.modalClose}
          onClick={onClose}
          type="button"
        >
          x
        </button>
        <motion.header className={styles.modalHeader}>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.08 }}
          >
            {group.index}
          </motion.span>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.12 }}
          >
            {group.signal}
          </motion.p>
          <motion.h2
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.16 }}
          >
            {group.title}
          </motion.h2>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          >
            {group.summary}
          </motion.p>
        </motion.header>
        <div className={styles.modalItemList}>
          {group.items.map((item, index) => (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              className={styles.modalItem}
              initial={{ opacity: 0, y: 14 }}
              key={item.title}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.24 + index * 0.06,
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: "easeOut",
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className={styles.modalItemTitleRow}>
                  <h3>{item.title}</h3>
                  <small>{item.meta}</small>
                </div>
                <p>{item.body}</p>
              </div>
            </motion.section>
          ))}
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function AchievementFlow() {
  const flowCanvasRef = useRef<HTMLDivElement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flowSize, setFlowSize] = useState<FlowSize>({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleGroup = useCallback((id: string) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  }, []);

  const closeModal = useCallback(() => {
    setExpandedId(null);
  }, []);

  useEffect(() => {
    const canvas = flowCanvasRef.current;

    if (!canvas) {
      return;
    }

    const updateSize = () => {
      const bounds = canvas.getBoundingClientRect();
      setFlowSize({
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      });
    };
    const observer = new ResizeObserver(updateSize);

    updateSize();
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  const flowPositions = useMemo(() => getFlowPositions(flowSize), [flowSize]);
  const activeGroup = useMemo(
    () => achievementGroups.find((group) => group.id === expandedId) ?? null,
    [expandedId],
  );

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeModal]);

  const baseNodes = useMemo<DossierNode[]>(
    () =>
      achievementGroups.map((group) => ({
        id: group.id,
        data: {
          ...group,
          footer: cardFooters[group.id],
          isExpanded: false,
          isHovered: false,
          onHover: setHoveredId,
          onToggle: toggleGroup,
          shouldReduceMotion: Boolean(shouldReduceMotion),
        },
        draggable: true,
        position: flowPositions[group.id],
        selectable: false,
        type: "dossier",
      })),
    [flowPositions, shouldReduceMotion, toggleGroup],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<DossierNode>(baseNodes);

  useEffect(() => {
    if (!flowSize.width || !flowSize.height) {
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        position: flowPositions[node.id] ?? node.position,
      })),
    );
  }, [flowPositions, flowSize.height, flowSize.width, setNodes]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          zIndex: expandedId === node.id ? 30 : hoveredId === node.id ? 20 : 1,
        },
        zIndex: expandedId === node.id ? 30 : hoveredId === node.id ? 20 : 1,
        data: {
          ...node.data,
          isExpanded: expandedId === node.id,
          isHovered: hoveredId === node.id,
          onHover: setHoveredId,
          onToggle: toggleGroup,
          shouldReduceMotion: Boolean(shouldReduceMotion),
        },
      })),
    );
  }, [expandedId, hoveredId, setNodes, shouldReduceMotion, toggleGroup]);

  const edges = useMemo<Edge[]>(
    () =>
      [
        {
          id: "athletics-technology",
          source: "athletics",
          target: "technology",
        },
        {
          id: "technology-business",
          source: "technology",
          target: "business",
        },
        {
          id: "business-leadership",
          source: "business",
          target: "leadership",
        },
      ].map((edge) => ({
        ...edge,
        animated: false,
        className: `${styles.flowEdge} ${
          shouldReduceMotion ? "" : styles.flowEdgeAnimated
        }`,
        style: {
          opacity:
            expandedId && !edge.id.includes(expandedId)
              ? 0.24
              : expandedId
                ? 0.92
                : 0.74,
          stroke: "#ffcc00",
          strokeWidth: expandedId && edge.id.includes(expandedId) ? 2.6 : 2,
        },
      })),
    [expandedId, shouldReduceMotion],
  );

  return (
    <section
      className={styles.scene}
      id="highlights"
      aria-label="Grouped achievements"
    >
      <motion.div
        animate={{ opacity: 1 }}
        className={styles.overview}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.36, ease: "easeOut" }}
      >
        <svg
          className={styles.ambientField}
          viewBox="0 0 1000 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {ambientPaths.map((path, index) => (
            <motion.path
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity:
                        index === 1
                          ? [0.08, 0.14, 0.08]
                          : [0.05, 0.1, 0.05],
                      x: index % 2 === 0 ? [0, 10, 0] : [0, -8, 0],
                      y: index % 2 === 0 ? [0, -6, 0] : [0, 5, 0],
                    }
              }
              className={styles.ambientLine}
              d={path}
              key={path}
              transition={{
                duration: hoveredId ? 26 + index : 16 + index,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          ))}
        </svg>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={styles.overviewCopy}
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: 0.42 }}
        >
          <span className={styles.introKicker}>/ Achievement dossier</span>
          <h2
            aria-label="Selected proofs, not scattered claims"
            className={styles.overviewTitle}
          >
            {headingWords.map((word, index) => (
              <motion.span
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                key={word}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.12 + index * 0.055,
                  duration: 0.36,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p>
            Four domains. One throughline. Rigor, discipline, and applied work
            under pressure.
          </p>
          <span className={styles.signalLine}>
            <span aria-hidden="true" />
            React Flow proof map
          </span>
        </motion.div>

        <div
          className={styles.flowCanvas}
          ref={flowCanvasRef}
          aria-label="Achievement map"
        >
          <ReactFlow
            aria-label="Achievement category map"
            className={styles.reactFlowSurface}
            defaultViewport={{ x: 0, y: 0, zoom: flowZoom }}
            edges={edges}
            elementsSelectable={false}
            maxZoom={0.92}
            minZoom={0.72}
            nodeTypes={nodeTypes}
            nodes={nodes}
            nodesConnectable={false}
            nodesDraggable
            onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
            onNodeMouseLeave={() => setHoveredId(null)}
            onNodesChange={onNodesChange}
            panOnDrag={false}
            panOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
          >
            <Background
              color="rgba(240, 236, 227, 0.045)"
              gap={96}
              variant={BackgroundVariant.Lines}
            />
          </ReactFlow>
        </div>

        <div className={styles.mobileFlowList}>
          {achievementGroups.map((group) => (
            <DossierButton
              key={group.id}
              data={{
                ...group,
                footer: cardFooters[group.id],
                isExpanded: expandedId === group.id,
                isHovered: hoveredId === group.id,
                onHover: setHoveredId,
                onToggle: toggleGroup,
                shouldReduceMotion: Boolean(shouldReduceMotion),
              }}
            />
          ))}
        </div>

        <AnimatePresence>
          {activeGroup ? (
            <DetailModal
              group={activeGroup}
              key={activeGroup.id}
              onClose={closeModal}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
