import type { ProjectPreview as ProjectPreviewVariant } from "@/content/types";

interface ProjectPreviewProps {
  variant: ProjectPreviewVariant;
}

function MarginPreview() {
  return (
    <div className="project-preview" data-variant="margin" aria-hidden="true">
      <div className="pv-window-bar">
        <span className="pv-window-brand">余白</span>
        <span className="pv-window-meta">阅读 / 04</span>
        <span className="pv-window-dots">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="pv-margin-body">
        <div className="pv-reader-page">
          <span className="pv-overline">Notes on attention</span>
          <strong>
            把注意力
            <br />
            还给文字
          </strong>
          <div className="pv-reader-lines">
            <span style={{ width: "94%" }} />
            <span style={{ width: "86%" }} />
            <span style={{ width: "71%" }} />
          </div>
          <p className="pv-highlighted-line">
            <ins>留白不是空的，它是阅读的呼吸。</ins>
          </p>
          <div className="pv-reader-lines">
            <span style={{ width: "88%" }} />
            <span style={{ width: "62%" }} />
          </div>
        </div>

        <div className="pv-margin-note">
          <span className="pv-note-number">旁注 01</span>
          <p>这里的停顿，比再加一次加粗更有效。</p>
          <span className="pv-note-rule" />
          <span className="pv-note-author">CY</span>
        </div>
      </div>

      <div className="pv-reader-footer">
        <span>安静地读完</span>
        <span className="pv-progress">
          <i />
        </span>
        <span>64%</span>
      </div>
    </div>
  );
}

function ScalePreview() {
  return (
    <div className="project-preview" data-variant="scale" aria-hidden="true">
      <div className="pv-window-bar">
        <span className="pv-window-brand">标尺</span>
        <span className="pv-window-meta">中文界面 / Type system</span>
        <span className="pv-window-dots">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="pv-scale-body">
        <div className="pv-scale-specimen">
          <span className="pv-scale-glyph">永</span>
          <div>
            <span>正文</span>
            <strong>19 / 1.85</strong>
          </div>
        </div>

        <div className="pv-scale-steps">
          <div className="pv-scale-row" data-size="lg">
            <span>Display</span>
            <strong>界面的秩序</strong>
            <em>64</em>
          </div>
          <div className="pv-scale-row" data-size="md">
            <span>Heading</span>
            <strong>阅读的形状</strong>
            <em>36</em>
          </div>
          <div className="pv-scale-row" data-size="sm">
            <span>Body</span>
            <strong>把复杂说清楚，是一种设计能力。</strong>
            <em>19</em>
          </div>
        </div>
      </div>

      <div className="pv-scale-tokens">
        <span>--text-body: 1.1875rem</span>
        <span className="pv-token-accent">--leading: 1.85</span>
      </div>
    </div>
  );
}

function AfterimagePreview() {
  return (
    <div className="project-preview" data-variant="afterimage" aria-hidden="true">
      <div className="pv-after-image">
        <span className="pv-after-orbit pv-after-orbit-one" />
        <span className="pv-after-orbit pv-after-orbit-two" />
        <span className="pv-after-bar" />
        <span className="pv-after-number">024</span>
        <span className="pv-after-word">余像</span>
        <span className="pv-after-caption">
          Seed 024 / 一种不重复的排列
        </span>
      </div>
      <div className="pv-after-footer">
        <span>AFTERIMAGE</span>
        <span>GENERATIVE TYPE STUDY</span>
        <span>2025</span>
      </div>
    </div>
  );
}

export function ProjectPreview({ variant }: ProjectPreviewProps) {
  if (variant === "margin") {
    return <MarginPreview />;
  }

  if (variant === "scale") {
    return <ScalePreview />;
  }

  return <AfterimagePreview />;
}
