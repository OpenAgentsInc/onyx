'use dom';

import * as React from 'react';
import type { CSSProperties } from 'react';

const styles = {
  root: {
    position: 'relative' as const,
  },
  placeholder: {
    opacity: 0.7,
    fontStyle: 'italic' as const,
  },
  displayed: {
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    pointerEvents: 'none' as const,
    overflowWrap: 'anywhere' as const,
  },
  hidden: {
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    pointerEvents: 'none' as const,
    overflowWrap: 'anywhere' as const,
    position: 'absolute' as const,
    visibility: 'hidden' as const,
    width: '100%',
    overflow: 'auto' as const,
  },
  block: {
    display: 'inline-block',
    width: '1ch',
    background: '#fff',
    height: 'calc(16px * 1.5)',
    verticalAlign: 'bottom',
  },
  blockFocused: {
    background: '#fff',
  },
  blink: {
    animation: 'blink 1s step-start 0s infinite',
  },
  hiddenElement: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: 'transparent',
    background: 'transparent',
    caretColor: 'transparent',
    border: 'none',
    resize: 'none' as const,
    outline: 'none',
    overflow: 'hidden' as const,
    padding: 0,
    margin: 0,
    lineHeight: 1.5,
    fontSize: '16px',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    WebkitTextFillColor: 'transparent',
  },
} satisfies Record<string, CSSProperties>;

// Add global styles for blink animation
const globalStyles = `
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoPlay?: string;
  autoPlaySpeedMS?: number;
  isBlink?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  autoPlay, 
  autoPlaySpeedMS = 40, 
  isBlink = true,
  placeholder, 
  onChange,
  style,
  ...rest 
}) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const measurementRef = React.useRef<HTMLDivElement | null>(null);

  const [text, setText] = React.useState<string>(rest.defaultValue?.toString() || rest.value?.toString() || '');
  const [isAutoPlaying, setIsAutoPlaying] = React.useState<boolean>(!!autoPlay);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [selectionStart, setSelectionStart] = React.useState<number>(0);

  const autoPlayIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoPlayIndexRef = React.useRef<number>(0);

  // Add global styles on mount
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  React.useEffect(() => {
    if (textAreaRef.current && isFocused) {
      textAreaRef.current.setSelectionRange(selectionStart, selectionStart);
    }
  }, [selectionStart, isFocused]);

  React.useEffect(() => {
    if (rest.value !== undefined) {
      const val = rest.value.toString();
      setText(val);
      setIsAutoPlaying(false);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      setSelectionStart(val.length);
    }
  }, [rest.value]);

  React.useEffect(() => {
    if (autoPlay && !rest.value && !rest.defaultValue) {
      setIsAutoPlaying(true);
      autoPlayIndexRef.current = 0;
      setText('');
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

      autoPlayIntervalRef.current = setInterval(() => {
        autoPlayIndexRef.current++;
        if (!autoPlay) return;
        if (autoPlayIndexRef.current > autoPlay.length) {
          setIsAutoPlaying(false);
          clearInterval(autoPlayIntervalRef.current!);
          return;
        }
        const newText = autoPlay.slice(0, autoPlayIndexRef.current);
        setText(newText);
        setSelectionStart(newText.length);
      }, autoPlaySpeedMS);
    }

    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [autoPlay, rest.value, rest.defaultValue]);

  const resizeTextArea = React.useCallback(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    resizeTextArea();
    window.addEventListener('resize', resizeTextArea);
    return () => window.removeEventListener('resize', resizeTextArea);
  }, [resizeTextArea]);

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setIsAutoPlaying(false);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    resizeTextArea();
    if (onChange) {
      onChange(e);
    }
    setSelectionStart(e.target.selectionStart ?? 0);
  };

  const onHandleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart ?? 0);
  };

  const onHandleFocus = () => {
    setIsFocused(true);
    if (textAreaRef.current) {
      setSelectionStart(textAreaRef.current.selectionStart ?? 0);
    }
  };

  const onHandleBlur = () => {
    setIsFocused(false);
  };

  const onHandleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    textarea.focus();
    setSelectionStart(textarea.selectionStart ?? 0);
  };

  const isPlaceholderVisible = !text && placeholder;

  const rootStyle: CSSProperties = {
    ...styles.root,
    ...style,
  };

  const blockStyle: CSSProperties = {
    ...styles.block,
    ...(isFocused && styles.blockFocused),
    ...(isBlink && styles.blink),
  };

  return (
    <div style={rootStyle}>
      <div style={{
        ...styles.displayed,
        ...(isPlaceholderVisible && styles.placeholder),
      }}>
        {isPlaceholderVisible ? placeholder : text.substring(0, selectionStart)}
        {!isPlaceholderVisible && <span style={blockStyle}></span>}
        {!isPlaceholderVisible && text.substring(selectionStart)}
      </div>

      <div ref={measurementRef} style={styles.hidden}></div>

      <textarea
        style={styles.hiddenElement}
        ref={textAreaRef}
        value={text}
        aria-placeholder={placeholder}
        onFocus={onHandleFocus}
        onBlur={onHandleBlur}
        onChange={onHandleChange}
        onSelect={onHandleSelect}
        onClick={onHandleClick}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        data-gramm="false"
        {...rest}
      />
    </div>
  );
};

export default TextArea;