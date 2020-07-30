package Model

type flagDefine struct {
	loggingMode string
}

func NewFlagDefine(l string) *flagDefine {
	return &flagDefine{
		loggingMode: l,
	}
}
