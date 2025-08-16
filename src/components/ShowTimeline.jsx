import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import "./ShowTimeline.css";

export default function ShowTimeline({ dateArray }) {
  const [zoom, setZoom] = useState(100); // width per date cell
  const zoomRef = useRef(zoom);
  const containerRef = useRef(null);
  const pendingRef = useRef(null);

  // wheel gesture state
  const gestureActiveRef = useRef(false);
  const accumScaleRef = useRef(1);
  const initialRef = useRef({ fraction: 0, mouseClientX: 0, baseZoom: 100 });
  const rafRef = useRef(null);
  const wheelTimeoutRef = useRef(null);

  let colorList = [
    "#2E7D32",
    "#66BB6A",
    "#A5D6A7",
    "#9E9E9E",
    "#FFEB3B",
    "#BDBDBD",
    "#FFF59D",
  ];

  // keep zoomRef in sync
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // ---------------- SMOOTH WHEEL ZOOM ----------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const MAX_ZOOM = 12000;
    const MIN_ZOOM = 100;

    const scheduleRaf = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const base = initialRef.current.baseZoom || zoomRef.current;
        let targetZoom = base * accumScaleRef.current;
        targetZoom = Math.max(MIN_ZOOM, Math.min(targetZoom, MAX_ZOOM));

        zoomRef.current = targetZoom;
        setZoom(targetZoom);

        pendingRef.current = {
          fraction: initialRef.current.fraction,
          mouseClientX: initialRef.current.mouseClientX,
        };
      });
    };

    const resetGesture = () => {
      gestureActiveRef.current = false;
      accumScaleRef.current = 1;
      initialRef.current.baseZoom = zoomRef.current;
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = null;
      }
    };

    const handlePointerMove = (e) => {
      if (!gestureActiveRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouseClientX = e.clientX - rect.left;
      const scrollWidth = Math.max(container.scrollWidth, 1);
      const fraction = (container.scrollLeft + mouseClientX) / scrollWidth;
      initialRef.current.fraction = fraction;
      initialRef.current.mouseClientX = mouseClientX;
    };

    const handleWheel = (e) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseClientX = e.clientX - rect.left;
      const scrollWidth = Math.max(container.scrollWidth, 1);
      const mouseAbsX = container.scrollLeft + mouseClientX;

      if (!gestureActiveRef.current) {
        gestureActiveRef.current = true;
        initialRef.current.fraction = mouseAbsX / scrollWidth;
        initialRef.current.mouseClientX = mouseClientX;
        initialRef.current.baseZoom = zoomRef.current;
        accumScaleRef.current = 1;
      }

      const factor = Math.exp(-e.deltaY * 0.0025);
      accumScaleRef.current *= factor;

      scheduleRaf();

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => resetGesture(), 120);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointermove", handlePointerMove);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointermove", handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  // apply scroll correction after DOM updates
  useLayoutEffect(() => {
    if (!pendingRef.current) return;
    const container = containerRef.current;
    if (!container) {
      pendingRef.current = null;
      return;
    }

    const { fraction, mouseClientX } = pendingRef.current;
    const scrollWidth = Math.max(container.scrollWidth, 1);
    const desiredScrollLeft = fraction * scrollWidth - mouseClientX;

    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.clientWidth
    );
    container.scrollLeft = Math.max(
      0,
      Math.min(desiredScrollLeft, maxScrollLeft)
    );

    pendingRef.current = null;
  }, [zoom]);

  return (
    <div>
      <div className="show-dates" ref={containerRef}>
        {dateArray.length > 0 &&
          dateArray.map((date, index) => (
            <div
              key={index}
              className="timeline-date"
              style={{
                minWidth: `${zoom}px`,
                transition: "none",
              }}
            >
              <div className="date-time-label">
                <div
                  className="date-label"
                  style={{
                    left: `${zoom > 200 ? "-30px" : "-15px"}`,
                  }}
                >
                  {zoom > 200 && <div>00:00</div>}
                  {date.day.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    ...(zoom > 200 && { year: "numeric" }),
                  })}
                </div>
                <div className="time-label">
                  <div></div>
                  {zoom > 1200 && <div>01:00</div>}
                  {zoom > 1200 && <div>02:00</div>}
                  {zoom > 800 && <div>03:00</div>}
                  {zoom > 1200 && <div>04:00</div>}
                  {zoom > 1200 && <div>05:00</div>}
                  {zoom > 400 && <div>06:00</div>}
                  {zoom > 1200 && <div>07:00</div>}
                  {zoom > 1200 && <div>08:00</div>}
                  {zoom > 800 && <div>09:00</div>}
                  {zoom > 1200 && <div>10:00</div>}
                  {zoom > 1200 && <div>11:00</div>}
                  {zoom > 200 && <div>12:00</div>}
                  {zoom > 1200 && <div>13:00</div>}
                  {zoom > 1200 && <div>14:00</div>}
                  {zoom > 800 && <div>15:00</div>}
                  {zoom > 1200 && <div>16:00</div>}
                  {zoom > 1200 && <div>17:00</div>}
                  {zoom > 400 && <div>18:00</div>}
                  {zoom > 1200 && <div>19:00</div>}
                  {zoom > 1200 && <div>20:00</div>}
                  {zoom > 800 && <div>21:00</div>}
                  {zoom > 1200 && <div>22:00</div>}
                  {zoom > 1200 && <div>23:00</div>}
                  <div></div>
                </div>
              </div>
              <div className="date-bar">
                {date.time.map((t, i) => (
                  <div
                    key={i}
                    className="time-bar"
                    style={{ backgroundColor: `${colorList[t]}` }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
