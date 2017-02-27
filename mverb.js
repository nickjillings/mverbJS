if (typeof MVerb === "undefined") {
    window.MVerb = function () {

        function Allpass(arrayType, maxLength) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }

            // == Private ==
            var buffer, index, Length, Feedback;
            buffer = new arrayType(maxLength);

            // == Public ==
            /*
                Allpass::output
                Process an audio samples
                
                @param input
                input value. NOTE: Unprotected for speed
            */
            this.output = function (input) {
                var output, bufout, temp;
                bufout = buffer[index];
                temp = input * -Feedback;
                output = bufout + temp;
                buffer[index] = input + ((bufout + temp) * Feedback);
                if (++index >= Length) {
                    index = 0;
                }
                return output;
            };

            /*
                Allpass::setLength
                Set the length of the delay in samples
                
                @param newLength
                New sample value
            */
            this.setLength = function (newLength) {
                if (typeof newLength !== "number") {
                    throw ("newLength not a number");
                }
                newLength = Math.min(Math.max(newLength, 0), maxLength);
                Length = newLength;
            };

            /* 
                Allpass::setFeedback
                Set the feedback value
                
                @param newFeedback
                New feedback value
            */
            this.setFeedback = function (newFeedback) {
                if (typeof newFeedback !== "number") {
                    throw ("newFeedback not a number");
                }
                Feedback = newFeedback;
            };

            /*
                Allpass:clear
                Clear the buffer
            */
            this.clear = function () {
                if (buffer.fill) {
                    buffer.fill(0);
                } else {
                    buffer.forEach(function (e, i, a) {
                        a[i] = 0;
                    });
                }
                index = 0;
            };

            /*
                Allpass::getLength
                Get the current delay length in samples
            */
            this.getLength = function () {
                return Length;
            };

            // == Constructor ==
            this.setLength(maxLength - 1);
            this.clear();
            this.setFeedback(0.5);
        };

        function StaticAllpassFourTap(arrayType, maxLength) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }

            // == Private ==
            var buffer = new arrayType(maxLength),
                indexes = [0, 0, 0, 0],
                Length, Feedback;

            // == Public ==
            /*
                StaticAllpassFourTap::operator
                Process a sample
                
                @param input
                Input sample. NOTE: Unprotected
            */
            this.operator = function (input) {
                var output, bufout, temp;
                bufout = buffer[indexes[0]];
                temp = input * -Feedback;
                output = bufout + temp;
                buffer[indexes[0]] = input + ((bufout + temp) * Feedback);

                if (++indexes[0] >= Length) {
                    indexes[0] = 0;
                }
                if (++indexes[1] >= Length) {
                    indexes[1] = 0;
                }
                if (++indexes[2] >= Length) {
                    indexes[2] = 0;
                }
                if (++indexes[3] >= Length) {
                    indexes[3] = 0;
                }
                return output;
            }

            /*
                StaticAllpassFourTap::setIndex
                Set the index points for the taps
                
                @param index1
                Set tap1
                @param index2
                Set tap2
                @param index3
                Set tap3
                @param index4
                Set tap4
            */
            this.setIndex = function (Index1, Index2, Index3, Index4) {
                if (typeof Index1 !== "number" || Index1 < 0 || Index1 != Math.floor(Index1)) {
                    throw ("Invalid. Indexes must be a positive integer");
                }
                if (typeof Index2 !== "number" || Index2 < 0 || Index2 != Math.floor(Index2)) {
                    throw ("Invalid. Indexes must be a positive integer");
                }
                if (typeof Index3 !== "number" || Index3 < 0 || Index3 != Math.floor(Index3)) {
                    throw ("Invalid. Indexes must be a positive integer");
                }
                if (typeof Index4 !== "number" || Index4 < 0 || Index4 != Math.floor(Index4)) {
                    throw ("Invalid. Indexes must be a positive integer");
                }
                indexes = [Index1, Index2, Index3, Index4];
            };

            /*
                StaticAllpassFourTap::getIndex
                Get the value pointed at by the index
                
                @param Index
                The tap number to extract
            */
            this.getIndex = function (Index) {
                if (Index < 0 || Index >= 4) {
                    Index = 0;
                }
                return buffer[indexes[Index]];
            };

            /*
                StaticAllpassFourTap::setLength
                Set the length of delay
                
                @param newLength
                The new length in samples
            */
            this.setLength = function (newLength) {
                Length = Math.min(Math.max(0, newLength), maxLength);
            };

            /* 
                StaticAllpassFourTap::setFeedback
                Set the feedback value
                
                @param newFeedback
                New feedback value
            */
            this.setFeedback = function (newFeedback) {
                if (typeof newFeedback !== "number") {
                    throw ("newFeedback not a number");
                }
                Feedback = newFeedback;
            };

            /*
                StaticAllpassFourTap:clear
                Clear the buffer
            */
            this.clear = function () {
                if (buffer.fill) {
                    buffer.fill(0);
                } else {
                    buffer.forEach(function (e, i, a) {
                        a[i] = 0;
                    });
                }
            };

            /*
                StaticAllpassFourTap::getLength
                Get the current delay length in samples
            */
            this.getLength = function () {
                return Length;
            };

            // == Constructor ==
            this.setLength(maxLength - 1);
            this.clear();
            this.setFeedback(0.5);
        };

        function StaticDelayLine(arrayType, maxLength) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }

            // == Private ==
            var buffer = new arrayType(maxLength),
                index, Length, Feedback;

            // == Public ==
            this.operator = function (input) {
                var output = buffer[index];
                buffer[index++] = input;
                if (index >= Length) {
                    index = 0;
                }
                return output;
            };

            this.setLength = function (newLength) {
                Length = Math.min(Math.max(0, newLength), maxLength);
            };

            this.clear = function () {
                if (buffer.fill) {
                    buffer.fill(0);
                } else {
                    buffer.forEach(function (e, i, a) {
                        a[i] = 0.0;
                    });
                }
                index = 0;
            };

            this.getLength = function () {
                return Length;
            }

            // == Constructor ==
            this.setLength(maxLength - 1);
            this.clear();
        };

        function StaticDelayLineNTap(arrayType, maxLength, N) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }
            if (typeof N !== "number" || N <= 0 || N !== Math.floor(N)) {
                throw ("Invalid constructor. N must be a positive integer");
            }

            // == Private ==
            var maxTaps = N,
                buffer = new arrayType(maxLength),
                indexes = new Int32Array(maxTaps),
                Length, Feedback;

            function incrementIndexes() {
                var n;
                for (n = 0; n < maxTaps; n++) {
                    if (++indexes[n] > Length) {
                        indexes[n] = 0;
                    }
                }
            }


            // == Public ==

            this.operator = function (input) {
                var output = buffer[indexes[0]];
                buffer[indexes[0]] = input;
                incrementIndexes();
                return output;
            }

            this.setIndexes = function (Indexes) {
                if (Indexes.length !== maxTaps) {
                    throw ("Index length must equal the number of taps");
                }
                var i;
                for (i = 0; i < maxTaps; i++) {
                    indexes[i] = Indexes[i];
                }
            };

            this.getIndex = function (Index) {
                if (Index >= maxTaps || Index < 0) {
                    Index = 0;
                }
                return buffer[indexes[Index]];
            };

            this.setLength = function (newLength) {
                Length = Math.min(Math.max(0, newLength), maxLength);
            };

            this.clear = function () {
                if (buffer.fill) {
                    buffer.fill(0);
                } else {
                    buffer.forEach(function (e, i, a) {
                        a[i] = 0.0;
                    });
                }
            };

            this.getLength = function () {
                return Length;
            }

            // == Constructor ==
            this.setLength(maxLength - 1);
            this.clear();
        };

        function StaticDelayLineFourTaps(arrayType, maxLength) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }
            this.__proto__ = new StaticDelayLineNTap(arrayType, maxLength, 4);

            this.setIndex = function (Index1, Index2, Index3, Index4) {
                if (typeof Index1 !== "number" || Index1 < 0 || Index1 !== Math.floor(Index1)) {
                    throw ("Invalid index");
                }
                if (typeof Index2 !== "number" || Index2 < 0 || Index2 !== Math.floor(Index2)) {
                    throw ("Invalid index");
                }
                if (typeof Index3 !== "number" || Index3 < 0 || Index3 !== Math.floor(Index3)) {
                    throw ("Invalid index");
                }
                if (typeof Index4 !== "number" || Index4 < 0 || Index4 !== Math.floor(Index4)) {
                    throw ("Invalid index");
                }
                this.setIndexes([Index1, Index2, Index3, Index4]);
            }
        };

        function StaticDelayLineEightTaps(arrayType, maxLength) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof maxLength !== "number" || maxLength <= 0 || maxLength !== Math.floor(maxLength)) {
                throw ("All. Invalid constructor. maxLength must be a positive integer");
            }
            this.__proto__ = new StaticDelayLineNTap(arrayType, maxLength, 8);

            this.setIndex = function (Index1, Index2, Index3, Index4, Index5, Index6, Index7, Index8) {
                if (typeof Index1 !== "number" || Index1 < 0 || Index1 !== Math.floor(Index1)) {
                    throw ("Invalid index");
                }
                if (typeof Index2 !== "number" || Index2 < 0 || Index2 !== Math.floor(Index2)) {
                    throw ("Invalid index");
                }
                if (typeof Index3 !== "number" || Index3 < 0 || Index3 !== Math.floor(Index3)) {
                    throw ("Invalid index");
                }
                if (typeof Index4 !== "number" || Index4 < 0 || Index4 !== Math.floor(Index4)) {
                    throw ("Invalid index");
                }
                if (typeof Index5 !== "number" || Index5 < 0 || Index5 !== Math.floor(Index5)) {
                    throw ("Invalid index");
                }
                if (typeof Index6 !== "number" || Index6 < 0 || Index6 !== Math.floor(Index6)) {
                    throw ("Invalid index");
                }
                if (typeof Index7 !== "number" || Index7 < 0 || Index7 !== Math.floor(Index7)) {
                    throw ("Invalid index");
                }
                if (typeof Index8 !== "number" || Index8 < 0 || Index8 !== Math.floor(Index8)) {
                    throw ("Invalid index");
                }
                this.setIndexes([Index1, Index2, Index3, Index4, Index5, Index6, Index7, Index8]);
            }
        };

        function StateVariable(arrayType, OverSampleCount) {
            if (arrayType !== Float32Array || arrayType !== Float64Array) {
                arrayType = Float32Array;
            }
            if (typeof OverSampleCount !== "number" || OverSampleCount <= 0 || OverSampleCount !== Math.floor(OverSampleCount)) {
                throw ("All. Invalid constructor. OverSampleCount must be a positive integer");
            }

            // == Private ==
            var sampleRate, frequency, q, f, bands = [0, 0, 0, 0],
                outIndex;

            function updateCoefficient() {
                f = 2.0 * Math.sin(3.141592654 * frequency / sampleRate);
            };

            // == Public ==
            /*
                StateVariable::operator
                Process a sample
                
                @param input
                Input sample. Note: Unprotected for speed
            */
            this.operator = function (input) {
                var n;
                for (n = 0; n < OverSampleCount; n++) {
                    bands[0] += f * bands[2] + 1e-25;
                    bands[1] = input - bands[0] - q * bands[2];
                    bands[2] += f * bands[1];
                    bands[3] = bands[0] + bands[1];
                }
                return bands[outIndex];
            };

            /* 
                StateVariable::reset
                Reset the states
            */
            this.reset = function () {
                bands = [0, 0, 0, 0];
            };

            /*
                StateVariable::setSampleRate
                Set the system sample rate
                
                @param newSampleRate
                The original system rate in Hertz
            */
            this.setSampleRate = function (newSampleRate) {
                sampleRate = newSampleRate * OverSampleCount;
                updateCoefficient();
            };

            /*
                StateVariable::setFrequency
                Set the filter frequency
                
                @param newFrequency
                The new frequency in Hertz
            */
            this.setFrequency = function (newFrequency) {
                frequency = newFrequency;
                updateCoefficient();
            };

            /*
                StateVariable::setResonance
                Set the Resonance
                
                @param newResonance
                The new resonance value
            */
            this.setResonance = function (newResonance) {
                q = 2 - 2 * newResonance;
            };

            /*
                StateVariable::setType
                Set the filter type
                
                @param type
                An integer or string representing the filter type
                0 = "lowpass" = Low Pass
                1 = "highpass" = High Pass
                2 = "bandpass" = Band Pass
                3 = "notch" = Notch
            */
            this.setType = function (type) {
                if (typeof type === "number") {
                    if (type < 0 || type >= 4) {
                        type = 0;
                    }
                    outIndex = type;
                } else if (typeof type === "string") {
                    switch (type) {
                        case "notch":
                            outIndex = 3;
                            break;
                        case "bandpass":
                            outIndex = 2;
                            break;
                        case "highpass":
                            outIndex = 1;
                            break;
                        case "lowpass":
                        default:
                            outIndex = 0;
                            break;
                    }
                }
            };

            // == Constructor ==

            this.setSampleRate(44100);
            this.setFrequency(1000);
            this.setResonance(0);
            this.setType("lowpass");
            this.reset();
        };

        // == Private ==
        var allpass = [new Allpass(Float32Array, 96000),
                      new Allpass(Float32Array, 96000),
                      new Allpass(Float32Array, 96000),
                      new Allpass(Float32Array, 96000)],
            allpassFourTap = [new StaticAllpassFourTap(Float32Array, 96000),
                             new StaticAllpassFourTap(Float32Array, 96000),
                             new StaticAllpassFourTap(Float32Array, 96000),
                             new StaticAllpassFourTap(Float32Array, 96000)],
            bandwidthFilter = [new StateVariable(Float32Array, 4), new StateVariable(Float32Array, 4)],
            damping = [new StateVariable(Float32Array, 4), new StateVariable(Float32Array, 4)],
            predelay = new StaticDelayLine(Float32Array, 96000),
            staticDelayLine = [new StaticDelayLineFourTaps(Float32Array, 96000),
                              new StaticDelayLineFourTaps(Float32Array, 96000),
                              new StaticDelayLineFourTaps(Float32Array, 96000),
                              new StaticDelayLineFourTaps(Float32Array, 96000)],
            earlyReflectionsDelayLine = [new StaticDelayLineEightTaps(Float32Array, 96000), new StaticDelayLineEightTaps(Float32Array, 96000)],
            parameters = {
                SampleRate: 44100,
                DampingFreq: 0,
                Density1: 0,
                Density2: 0,
                BandwidthFreq: 0,
                PreDelayTime: 4410,
                Decay: 0,
                Gain: 0,
                Mix: 0,
                EarlyMix: 0,
                Size: 0,
                MixSmooth: 0,
                EarlyLateSmooth: 0,
                BandwidthSmooth: 0,
                DampingSmooth: 0,
                PredelaySmooth: 0,
                SizeSmooth: 0,
                DensitySmooth: 0,
                DecaySmooth: 0,
                PreviousLeftTank: 0,
                PreviousRightTank: 0,
                ControlRate: 44,
                ControlRateCounter: 0
            };

        // == Public ==

        this.process = function (inputBuffer, outputBuffer) {
            // The inputBuffer and outputBuffer are an array of channels holding a frame of data
            var sampleFrames = inputBuffer[0].length,
                OneOverSampleFrames = 1 / sampleFrames,
                MixDelta = (parameters.Mix - parameters.MixSmooth) * OneOverSampleFrames,
                EarlyLateDelta = (parameters.EarlyMix - parameters.EarlyLateSmooth) * OneOverSampleFrames,
                BandwidthDelta = (((parameters.BandwidthFreq * 18400.) + 100.) - parameters.BandwidthSmooth) * OneOverSampleFrames,
                DampingDelta = (((parameters.DampingFreq * 18400.) + 100.) - parameters.DampingSmooth) * OneOverSampleFrames,
                PredelayDelta = ((parameters.PreDelayTime * 200 * (parameters.SampleRate / 1000)) - parameters.PredelaySmooth) * OneOverSampleFrames,
                SizeDelta = (parameters.Size - parameters.SizeSmooth) * OneOverSampleFrames,
                DecayDelta = (((0.7995 * parameters.Decay) + 0.005) - parameters.DecaySmooth) * OneOverSampleFrames,
                DensityDelta = (((0.7995 * parameters.Density1) + 0.005) - parameters.DensitySmooth) * OneOverSampleFrames,
                i;
            for (i = 0; i < sampleFrames; i++) {
                var left = inputBuffer[0][i],
                    right = inputBuffer[1][i];
                parameters.MixSmooth += MixDelta;
                parameters.EarlyLateSmooth += EarlyLateDelta;
                parameters.BandwidthSmooth += BandwidthDelta;
                parameters.DampingSmooth += DampingDelta;
                parameters.PredelaySmooth += PredelayDelta;
                parameters.SizeSmooth += SizeDelta;
                parameters.DecaySmooth += DecayDelta;
                parameters.DensitySmooth += DensityDelta;
                if (parameters.ControlRateCounter++ >= parameters.ControlRate) {
                    parameters.ControlRateCounter = 0;
                    bandwidthFilter[0].setFrequency(parameters.BandwidthSmooth);
                    bandwidthFilter[1].setFrequency(parameters.BandwidthSmooth);
                    damping[0].setFrequency(parameters.DampingSmooth);
                    damping[1].setFrequency(parameters.DampingSmooth);
                }
                predelay.setLength(parameters.PredelaySmooth);
                parameters.Density2 = parameters.DecaySmooth + 0.15;
                parameters.Density2 = Math.max(Math.min(parameters.Density2, 0.5), 0.25);
                allpassFourTap[1].setFeedback(parameters.Density2);
                allpassFourTap[3].setFeedback(parameters.Density2);
                allpassFourTap[0].setFeedback(parameters.Density1);
                allpassFourTap[2].setFeedback(parameters.Density1);
                var bandwidthLeft = bandwidthFilter[0].operator(left);
                var bandwidthRight = bandwidthFilter[1].operator(right);
                var earlyReflectionsL = earlyReflectionsDelayLine[0].operator(bandwidthLeft * 0.5 + bandwidthRight * 0.3);
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(2) * 0.6;
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(3) * 0.4;
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(4) * 0.3;
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(5) * 0.3;
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(6) * 0.1;
                earlyReflectionsL += earlyReflectionsDelayLine[0].getIndex(7) * 0.1;
                earlyReflectionsL += (bandwidthLeft * 0.4 + bandwidthRight * 0.2) * 0.5;
                var earlyReflectionsR = earlyReflectionsDelayLine[1].operator(bandwidthRight * 0.5 + bandwidthLeft * 0.3);
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(2) * 0.6;
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(3) * 0.4;
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(4) * 0.3;
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(5) * 0.3;
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(6) * 0.1;
                earlyReflectionsR += earlyReflectionsDelayLine[1].getIndex(7) * 0.1;
                earlyReflectionsR += (bandwidthRight * 0.4 + bandwidthLeft * 0.2) * 0.5;
                var predelayMonoInput = predelay.operator((bandwidthRight + bandwidthLeft) * 0.5);
                var smearedInput = predelayMonoInput;
                smearedInput = allpass[0].output(smearedInput);
                smearedInput = allpass[1].output(smearedInput);
                smearedInput = allpass[2].output(smearedInput);
                smearedInput = allpass[3].output(smearedInput);

                var leftTank = allpassFourTap[0].operator(smearedInput + parameters.PreviousRightTank);
                leftTank = staticDelayLine[0].operator(leftTank);
                leftTank = damping[0].operator(leftTank);
                leftTank = allpassFourTap[1].operator(leftTank);
                leftTank = staticDelayLine[1].operator(leftTank);

                var rightTank = allpassFourTap[2].operator(smearedInput + parameters.PreviousLeftTank);
                rightTank = staticDelayLine[2].operator(rightTank);
                rightTank = damping[1].operator(rightTank);
                rightTank = allpassFourTap[3].operator(rightTank);
                rightTank = staticDelayLine[3].operator(rightTank);

                parameters.PreviousLeftTank = leftTank * parameters.DecaySmooth;
                parameters.PreviousRightTank = rightTank * parameters.DecaySmooth;

                var accumulatorL = (0.6 * staticDelayLine[2].getIndex(1)) + (0.6 * staticDelayLine[2].getIndex(2)) - (0.6 * allpassFourTap[3].getIndex(1)) + (0.6 * staticDelayLine[3].getIndex(1)) - (0.6 * staticDelayLine[0].getIndex(1)) - (0.6 * allpassFourTap[1].getIndex(1)) - (0.6 * staticDelayLine[1].getIndex(1));
                var accumulatorR = (0.6 * staticDelayLine[0].getIndex(2)) + (0.6 * staticDelayLine[0].getIndex(3)) - (0.6 * allpassFourTap[1].getIndex(2)) + (0.6 * staticDelayLine[1].getIndex(2)) - (0.6 * staticDelayLine[2].getIndex(3)) - (0.6 * allpassFourTap[3].getIndex(2)) - (0.6 * staticDelayLine[3].getIndex(2));

                accumulatorL = ((accumulatorL * parameters.EarlyMix) + ((1 - parameters.EarlyMix) * earlyReflectionsL));
                accumulatorR = ((accumulatorR * parameters.EarlyMix) + ((1 - parameters.EarlyMix) * earlyReflectionsR));

                left = (left + parameters.MixSmooth * (accumulatorL - left)) * parameters.Gain;
                right = (right + parameters.MixSmooth * (accumulatorR - right)) * parameters.Gain;
                outputBuffer[0][i] = left;
                outputBuffer[1][i] = right;
            }
        }

        this.reset = function () {
            parameters.ControlRateCounter = 0;
            bandwidthFilter[0].setSampleRate(parameters.SampleRate);
            bandwidthFilter[1].setSampleRate(parameters.SampleRate);
            bandwidthFilter[0].reset();
            bandwidthFilter[1].reset();
            damping[0].setSampleRate(parameters.SampleRate);
            damping[1].setSampleRate(parameters.SampleRate);
            damping[0].reset();
            damping[1].reset();
            predelay.clear();
            predelay.setLength(parameters.PreDelayTime);
            allpass[0].clear();
            allpass[1].clear();
            allpass[2].clear();
            allpass[3].clear();
            allpass[0].setLength(Math.floor(0.0048 * parameters.SampleRate));
            allpass[1].setLength(Math.floor(0.0036 * parameters.SampleRate));
            allpass[2].setLength(Math.floor(0.0127 * parameters.SampleRate));
            allpass[3].setLength(Math.floor(0.0093 * parameters.SampleRate));
            allpass[0].setFeedback(0.75);
            allpass[1].setFeedback(0.75);
            allpass[2].setFeedback(0.625);
            allpass[3].setFeedback(0.625);
            allpassFourTap[0].clear();
            allpassFourTap[1].clear();
            allpassFourTap[2].clear();
            allpassFourTap[3].clear();
            allpassFourTap[0].setLength(Math.floor(0.020 * parameters.SampleRate * parameters.Size));
            allpassFourTap[1].setLength(Math.floor(0.060 * parameters.SampleRate * parameters.Size));
            allpassFourTap[2].setLength(Math.floor(0.030 * parameters.SampleRate * parameters.Size));
            allpassFourTap[3].setLength(Math.floor(0.089 * parameters.SampleRate * parameters.Size));
            allpassFourTap[0].setFeedback(parameters.Density1);
            allpassFourTap[1].setFeedback(parameters.Density2);
            allpassFourTap[2].setFeedback(parameters.Density1);
            allpassFourTap[3].setFeedback(parameters.Density2);
            allpassFourTap[0].setIndex(0, 0, 0, 0);
            allpassFourTap[1].setIndex(0, Math.floor(0.006 * parameters.SampleRate * parameters.Size), Math.floor(0.041 * parameters.SampleRate * parameters.Size), 0);
            allpassFourTap[2].setIndex(0, 0, 0, 0);
            allpassFourTap[3].setIndex(0, Math.floor(0.031 * parameters.SampleRate * parameters.Size), Math.floor(0.011 * parameters.SampleRate * parameters.Size), 0);
            staticDelayLine[0].clear();
            staticDelayLine[1].clear();
            staticDelayLine[2].clear();
            staticDelayLine[3].clear();
            staticDelayLine[0].setLength(Math.floor(0.15 * parameters.SampleRate * parameters.Size));
            staticDelayLine[1].setLength(Math.floor(0.12 * parameters.SampleRate * parameters.Size));
            staticDelayLine[2].setLength(Math.floor(0.14 * parameters.SampleRate * parameters.Size));
            staticDelayLine[3].setLength(Math.floor(0.11 * parameters.SampleRate * parameters.Size));
            staticDelayLine[0].setIndex(0, Math.floor(0.067 * parameters.SampleRate * parameters.Size), Math.floor(0.011 * parameters.SampleRate * parameters.Size), Math.floor(0.121 * parameters.SampleRate * parameters.Size));
            staticDelayLine[1].setIndex(0, Math.floor(0.036 * parameters.SampleRate * parameters.Size), Math.floor(0.089 * parameters.SampleRate * parameters.Size), 0);
            staticDelayLine[2].setIndex(0, Math.floor(0.0089 * parameters.SampleRate * parameters.Size), Math.floor(0.099 * parameters.SampleRate * parameters.Size), 0);
            staticDelayLine[3].setIndex(0, Math.floor(0.067 * parameters.SampleRate * parameters.Size), Math.floor(0.0041 * parameters.SampleRate * parameters.Size), 0);
            earlyReflectionsDelayLine[0].clear();
            earlyReflectionsDelayLine[1].clear();
            earlyReflectionsDelayLine[0].setLength(Math.floor(0.089 * parameters.SampleRate));
            earlyReflectionsDelayLine[0].setIndex(0, Math.floor(0.0199 * parameters.SampleRate), Math.floor(0.0219 * parameters.SampleRate), Math.floor(0.0354 * parameters.SampleRate), Math.floor(0.0389 * parameters.SampleRate), Math.floor(0.0414 * parameters.SampleRate), Math.floor(0.0692 * parameters.SampleRate), 0);
            earlyReflectionsDelayLine[1].setLength(Math.floor(0.069 * parameters.SampleRate));
            earlyReflectionsDelayLine[1].setIndex(0, Math.floor(0.0099 * parameters.SampleRate), Math.floor(0.011 * parameters.SampleRate), Math.floor(0.0182 * parameters.SampleRate), Math.floor(0.0189 * parameters.SampleRate), Math.floor(0.0213 * parameters.SampleRate), Math.floor(0.0431 * parameters.SampleRate), 0);
        }

        this.setParameter = function (index, value) {
            if (typeof index === "string" || (typeof index == "number" && index === Math.floor(index))) {
                if (typeof value !== "number") {
                    throw ("Invalid arguments");
                }
                switch (index) {
                    case "DAMPINGFREQ":
                    case "DampingFreq":
                    case 0:
                        parameters.DampingFreq = 1.0 - value;
                        break;
                    case "DENSITY":
                    case "Density":
                    case 1:
                        parameters.Density1 = value;
                        break;
                    case "BANDWIDTHFREQ":
                    case "BandwidthFreq":
                    case 2:
                        parameters.BandwidthFreq = value;
                        break;
                    case "PREDELAY":
                    case "PreDelay":
                    case "PreDelayTime":
                    case 3:
                        parameters.PreDelayTime = value;
                        break;
                    case "SIZE":
                    case "Size":
                    case 4:
                        parameters.Size = (0.95 * value) + 0.05;
                        allpassFourTap[0].clear();
                        allpassFourTap[1].clear();
                        allpassFourTap[2].clear();
                        allpassFourTap[3].clear();
                        allpassFourTap[0].setLength(Math.floor(0.020 * parameters.SampleRate * parameters.Size));
                        allpassFourTap[1].setLength(Math.floor(0.020 * parameters.SampleRate * parameters.Size));
                        allpassFourTap[2].setLength(Math.floor(0.020 * parameters.SampleRate * parameters.Size));
                        allpassFourTap[3].setLength(Math.floor(0.020 * parameters.SampleRate * parameters.Size));
                        allpassFourTap[1].setIndex(0, Math.floor(0.006 * parameters.SampleRate * parameters.Size), Math.floor(0.041 * parameters.SampleRate * parameters.Size), 0);
                        allpassFourTap[3].setIndex(0, Math.floor(0.031 * parameters.SampleRate * parameters.Size), Math.floor(0.011 * parameters.SampleRate * parameters.Size), 0);
                        staticDelayLine[0].clear();
                        staticDelayLine[1].clear();
                        staticDelayLine[2].clear();
                        staticDelayLine[3].clear();
                        staticDelayLine[0].setLength(Math.floor(0.15 * parameters.SampleRate * parameters.Size));
                        staticDelayLine[1].setLength(Math.floor(0.12 * parameters.SampleRate * parameters.Size));
                        staticDelayLine[2].setLength(Math.floor(0.14 * parameters.SampleRate * parameters.Size));
                        staticDelayLine[3].setLength(Math.floor(0.11 * parameters.SampleRate * parameters.Size));
                        staticDelayLine[0].setIndex(0, Math.floor(0.067 * parameters.SampleRate * parameters.Size), Math.floor(0.011 * parameters.SampleRate * parameters.Size), Math.floor(0.121 * parameters.SampleRate * parameters.Size));
                        staticDelayLine[1].setIndex(0, Math.floor(0.036 * parameters.SampleRate * parameters.Size), Math.floor(0.089 * parameters.SampleRate * parameters.Size), 0);
                        staticDelayLine[2].setIndex(0, Math.floor(0.0089 * parameters.SampleRate * parameters.Size), Math.floor(0.099 * parameters.SampleRate * parameters.Size), 0);
                        staticDelayLine[3].setIndex(0, Math.floor(0.067 * parameters.SampleRate * parameters.Size), Math.floor(0.0041 * parameters.SampleRate * parameters.Size), 0);
                        break;
                    case "DECAY":
                    case "Decay":
                    case 5:
                        parameters.Decay = value;
                        break;
                    case "GAIN":
                    case "Gain":
                    case 6:
                        parameters.Gain = value;
                        break;
                    case "MIX":
                    case "Mix":
                    case 7:
                        parameters.Mix = value;
                        break;
                    case "EARLYMIX":
                    case "EarlyMix":
                    case 8:
                        parameters.EarlyMix = value;
                        break;
                }
            } else {
                throw ("Invalid index");
            }
        };

        this.getParameter = function (index) {
            if (typeof index === "string" || (typeof index == "number" && index === Math.floor(index))) {
                if (typeof value !== "number") {
                    throw ("Invalid arguments");
                }
                switch (index) {
                    case "DAMPINGFREQ":
                    case "DampingFreq":
                    case 0:
                        return parameters.DampingFreq * 100.0;
                        break;
                    case "DENSITY":
                    case "Density":
                    case 1:
                        return parameters.Density1 * 100.0;
                        break;
                    case "BANDWIDTHFREQ":
                    case "BandwidthFreq":
                    case 2:
                        return parameters.BandwidthFreq * 100.0;
                        break;
                    case "PREDELAY":
                    case "PreDelay":
                    case "PreDelayTime":
                    case 3:
                        return parameters.PreDelayTime * 100.0;
                        break;
                    case "SIZE":
                    case "Size":
                    case 4:
                        return ((0.95 * parameters.Size) + 0.05) * 100.0;
                        break;
                    case "DECAY":
                    case "Decay":
                    case 5:
                        return parameters.Decay * 100.0;
                        break;
                    case "GAIN":
                    case "Gain":
                    case 6:
                        return parameters.Gain * 100.0;
                        break;
                    case "MIX":
                    case "Mix":
                    case 7:
                        return parameters.Mix * 100.0;
                        break;
                    case "EARLYMIX":
                    case "EarlyMix":
                    case 8:
                        return parameters.EarlyMix * 100.0;
                        break;
                }
            }
            throw ("Invalid index");
        };

        this.setSampleRate = function (newFS) {
            if (typeof newFS !== "number" || typeof newFS <= 0.0) {
                throw ("Invalid Sample Rate");
            }
            parameters.SampleRate = newFS;
            parameters.ControlRate = Math.floor(newFS / 1000);
            this.reset();
        }

        // == Constructor ==
        this.setParameter("DAMPINGFREQ", 0.0);
        this.setParameter("DENSITY", 0.5);
        this.setParameter("BANDWIDTHFREQ", 1.0);
        this.setParameter("DECAY", 0.5);
        this.setParameter("PREDELAY", 0.0);
        this.setParameter("SIZE", 0.5);
        this.setParameter("GAIN", 1.0);
        this.setParameter("MIX", 0.15);
        this.setParameter("EARLYMIX", 0.75);

        parameters.SampleRate = 44100.;
        parameters.PreviousLeftTank = 0.;
        parameters.PreviousRightTank = 0.;
        parameters.PreDelayTime = 100 * (parameters.SampleRate / 1000);
        parameters.MixSmooth = parameters.EarlyLateSmooth = parameters.BandwidthSmooth = parameters.DampingSmooth = PredelaySmooth = parameters.SizeSmooth = parameters.DecaySmooth = parameters.DensitySmooth = 0.;
        parameters.ControlRate = parameters.SampleRate / 1000;
        parameters.ControlRateCounter = 0;
        this.reset();

    };
}
