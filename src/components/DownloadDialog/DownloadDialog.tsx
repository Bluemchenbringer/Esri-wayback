import React, { FC } from 'react';

type Props = {
    closeButtonOnClick: () => void;
};

export const DownloadDialog: FC<Props> = ({ closeButtonOnClick }: Props) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-custom-modal-background flex items-center justify-center z-50">
            <div className="max-w-2xl mx-auto bg-custom-modal-content-background p-2 pb-8">
                <div className="text-right">
                    <calcite-button
                        icon-start="x"
                        appearance="transparent"
                        kind="neutral"
                        onClick={closeButtonOnClick}
                    />
                </div>

                <div className="px-8">
                    <h3 className="text-2xl mb-2">Download Local Tile Cache</h3>

                    <p className="text-sm mb-4">
                        Based on your current map extent, choose a scale range
                        for your download. Downloads are limited to 150,000
                        tiles.
                        {/* You can choose this window while your tiles are prepared. */}
                    </p>

                    <div></div>
                </div>
            </div>
        </div>
    );
};
