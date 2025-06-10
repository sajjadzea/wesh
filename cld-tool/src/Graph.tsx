import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import cytoscape from 'cytoscape';
import type { Core } from 'cytoscape';
import data from './data/sample.json';

export interface GraphHandle {
  exportJson(): string;
  importJson(json: string): void;
  updateNode(nodeData: any): void;
}

interface GraphProps {

