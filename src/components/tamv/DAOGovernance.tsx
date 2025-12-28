import { motion } from 'framer-motion';
import { Vote, ThumbsUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import daoImage from '@/assets/dao-governance.jpg';

const DAOGovernance = () => {
  const proposals = [
    { id: 1, title: "Nuevo módulo XR", votes: 85, status: "active" },
    { id: 2, title: "Fondo creadores", votes: 72, status: "active" },
    { id: 3, title: "API pública", votes: 91, status: "passed" },
  ];

  return (
    <div className="relative min-h-[600px] rounded-3xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={daoImage} alt="DAO Governance" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 grid md:grid-cols-2 gap-8 items-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              DEKATEOTL
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            11 capas de gobernanza ética
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              <Vote className="w-5 h-5 mr-2" />
              Votar
            </Button>
            <Button size="lg" variant="outline" className="border-indigo-500/50">
              Proponer
            </Button>
          </div>
        </motion.div>

        {/* Proposals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {proposals.map((proposal, i) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{proposal.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  proposal.status === 'passed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {proposal.status === 'passed' ? 'Aprobado' : 'Activo'}
                </span>
              </div>
              <Progress value={proposal.votes} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> {proposal.votes}%
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 2d restantes
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DAOGovernance;
