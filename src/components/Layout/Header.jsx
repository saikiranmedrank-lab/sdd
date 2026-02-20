import React from 'react';
import { CheckCircle, FolderOpen, ChevronsDown, ChevronsUp, Download, Upload, Trash2, Search } from 'lucide-react';
import Button from '../UI/Button';

export default function Header({
    onMarkNext,
    onOpenNext,
    onExpandAll,
    onCollapseAll,
    onExport,
    onImport,
    onReset,
    importInputRef
}) {
    return (
        <div className="header">
            <div className="wrap" style={{ paddingBottom: 0, paddingTop: 0 }}>
                <div className="topbar">
                    <div className="title">
                        <h1>SSC Progress Dashboard — English + Maths</h1>
                        <div className="subtitle">
                            ✅ Track completed classes, remaining hours, streak, and "next lesson".<br />
                            💾 Saves automatically in <b>localStorage</b>. You can also export/import your progress.
                        </div>
                    </div>

                    <div className="actions">
                        <Button variant="good" onClick={onMarkNext} title="Marks the next unfinished lesson as completed">
                            <CheckCircle size={16} /> Mark Next
                        </Button>
                        <Button variant="ghost" onClick={onOpenNext} title="Opens the module containing your next lesson">
                            <FolderOpen size={16} /> Open Next Module
                        </Button>
                        <Button onClick={onExpandAll}>
                            <ChevronsDown size={16} /> Expand All
                        </Button>
                        <Button onClick={onCollapseAll}>
                            <ChevronsUp size={16} /> Collapse All
                        </Button>
                        <Button variant="warn" onClick={onExport}>
                            <Download size={16} /> Export
                        </Button>
                        <Button as="label" variant="warn" htmlFor="importFile" title="Import progress JSON" style={{ cursor: 'pointer' }}>
                            <Upload size={16} /> Import
                            <input
                                id="importFile"
                                type="file"
                                accept="application/json"
                                style={{ display: 'none' }}
                                ref={importInputRef}
                                onChange={onImport}
                            />
                        </Button>
                        <Button onClick={onReset}>
                            <Trash2 size={16} /> Reset All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
